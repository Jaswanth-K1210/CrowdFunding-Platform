# Raise Fund Multi-Step Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single flat campaign creation form with a 5-step wizard that supports local image/document uploads via Cloudinary.

**Architecture:** Single-page React wizard controlled by `currentStep` state. Files held as `File` objects in state until final submit, then uploaded to Cloudinary via backend (multer → cloudinary SDK), URLs saved to Campaign model. No route changes needed.

**Tech Stack:** React, Tailwind CSS, multer (backend file handling), cloudinary npm SDK (backend upload), axios multipart/form-data

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `backend/package.json` | Add multer + cloudinary deps |
| Create | `backend/utils/cloudinaryUpload.js` | Cloudinary config + upload helper |
| Modify | `backend/controllers/campaignController.js` | Handle file buffers, upload, save URLs |
| Modify | `backend/routes/campaignRoutes.js` | Add multer middleware to POST /campaigns |
| Modify | `frontend/src/services/campaignService.js` | Send multipart/form-data |
| Modify | `frontend/src/pages/RaiseFund.jsx` | Full rewrite as 5-step wizard |

---

### Task 1: Install backend dependencies

**Files:**
- Modify: `backend/package.json`

- [ ] **Step 1: Install multer and cloudinary**

```bash
cd /Users/apple/Documents/Projects/crowdFunding/backend
npm install multer cloudinary
```

Expected: Both packages appear in `node_modules`, `package.json` updated.

- [ ] **Step 2: Commit**

```bash
git add backend/package.json backend/package-lock.json
git commit -m "chore: add multer and cloudinary dependencies"
```

---

### Task 2: Create Cloudinary upload utility

**Files:**
- Create: `backend/utils/cloudinaryUpload.js`

- [ ] **Step 1: Create the utility**

Create `backend/utils/cloudinaryUpload.js`:

```js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadBuffer = (buffer, folder, resourceType = "auto") =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: resourceType }, (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      })
      .end(buffer);
  });
```

- [ ] **Step 2: Commit**

```bash
git add backend/utils/cloudinaryUpload.js
git commit -m "feat: add cloudinary upload utility"
```

---

### Task 3: Add multer middleware to campaign route

**Files:**
- Modify: `backend/routes/campaignRoutes.js`

- [ ] **Step 1: Read the current routes file**

Read `backend/routes/campaignRoutes.js` to see the current imports and route definitions.

- [ ] **Step 2: Add multer import and middleware**

Add multer import at the top of `backend/routes/campaignRoutes.js`:

```js
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
```

Update the POST `/` route to use multer:

```js
// Before:
router.post("/", protect, createCampaign);

// After:
router.post("/", protect, upload.fields([
  { name: "images", maxCount: 5 },
  { name: "documents", maxCount: 5 },
]), createCampaign);
```

- [ ] **Step 3: Commit**

```bash
git add backend/routes/campaignRoutes.js
git commit -m "feat: add multer file upload middleware to campaign create route"
```

---

### Task 4: Update campaignController to handle file uploads

**Files:**
- Modify: `backend/controllers/campaignController.js`

- [ ] **Step 1: Add cloudinary import**

At the top of `backend/controllers/campaignController.js`, add:

```js
import { uploadBuffer } from "../utils/cloudinaryUpload.js";
```

- [ ] **Step 2: Replace createCampaign with file-upload-aware version**

Replace the `createCampaign` function body:

```js
export const createCampaign = async (req, res) => {
  try {
    const { title, description, category, goalAmount, location, deadline } = req.body;

    const imageFiles = req.files?.images || [];
    const documentFiles = req.files?.documents || [];

    const imageUrls = await Promise.all(
      imageFiles.map((f) => uploadBuffer(f.buffer, "crowdfunding/images", "image"))
    );
    const documentUrls = await Promise.all(
      documentFiles.map((f) => uploadBuffer(f.buffer, "crowdfunding/documents", "raw"))
    );

    const campaign = await Campaign.create({
      creatorId: req.user._id,
      title,
      description,
      category,
      goalAmount,
      images: imageUrls,
      documents: documentUrls,
      location,
      deadline,
      status: "pending",
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { "stats.campaignsCreated": 1 },
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
```

- [ ] **Step 3: Commit**

```bash
git add backend/controllers/campaignController.js
git commit -m "feat: upload images and documents to cloudinary on campaign creation"
```

---

### Task 5: Update frontend campaignService to send multipart/form-data

**Files:**
- Modify: `frontend/src/services/campaignService.js`

- [ ] **Step 1: Update create method**

Replace the `create` method in `frontend/src/services/campaignService.js`:

```js
create: (data) => {
  const form = new FormData();
  form.append("title", data.title);
  form.append("description", data.description);
  form.append("category", data.category);
  form.append("goalAmount", data.goalAmount);
  form.append("location", data.location || "");
  form.append("deadline", data.deadline);
  (data.images || []).forEach((file) => form.append("images", file));
  (data.documents || []).forEach((file) => form.append("documents", file));
  return api.post("/campaigns", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
},
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/services/campaignService.js
git commit -m "feat: send campaign creation as multipart/form-data"
```

---

### Task 6: Rewrite RaiseFund.jsx as 5-step wizard

**Files:**
- Modify: `frontend/src/pages/RaiseFund.jsx`

- [ ] **Step 1: Full rewrite**

Replace the entire contents of `frontend/src/pages/RaiseFund.jsx` with:

```jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { campaignService } from "../services/campaignService";
import { useAuth } from "../store/authStore";

const STEPS = ["Basics", "Story", "Images", "Documents", "Review"];

const CATEGORIES = [
  "education", "medical", "animals", "business",
  "ngo", "community", "emergency", "technology",
];

function ProgressBar({ current }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-all
              ${i + 1 < current ? "bg-emerald-500 text-white" :
                i + 1 === current ? "bg-emerald-600 text-white ring-4 ring-emerald-100" :
                "bg-gray-200 text-gray-500"}`}>
              {i + 1 < current ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i + 1 === current ? "text-emerald-600" : "text-gray-400"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-1.5 bg-gray-200 rounded-full mt-1">
        <div
          className="absolute top-0 left-0 h-1.5 bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${((current - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

function FilePreview({ files, onRemove, isImage }) {
  if (!files.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {files.map((file, i) => (
        <div key={i} className="relative group">
          {isImage ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 flex flex-col items-center justify-center bg-gray-100 rounded-lg border border-gray-200 p-1">
              <span className="text-2xl">📄</span>
              <span className="text-xs text-gray-500 truncate w-full text-center mt-1">{file.name}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function RaiseFund() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [basics, setBasics] = useState({
    title: "", category: "medical", goalAmount: "", deadline: "", location: "",
  });
  const [story, setStory] = useState({ description: "" });
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);

  const handleBasicsChange = (e) =>
    setBasics((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImageAdd = (e) => {
    const picked = Array.from(e.target.files);
    setImages((p) => [...p, ...picked].slice(0, 5));
    e.target.value = "";
  };

  const handleDocAdd = (e) => {
    const picked = Array.from(e.target.files);
    setDocuments((p) => [...p, ...picked].slice(0, 5));
    e.target.value = "";
  };

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!user) { toast.error("Please login first"); navigate("/login"); return; }
    setSubmitting(true);
    try {
      await campaignService.create({
        ...basics,
        goalAmount: Number(basics.goalAmount),
        description: story.description,
        images,
        documents,
      });
      toast.success("Campaign created! Pending admin approval.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all";

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Start Your Campaign</h2>
          <p className="text-gray-500">Step {step} of {STEPS.length} — {STEPS[step - 1]}</p>
        </div>

        <ProgressBar current={step} />

        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title *</label>
              <input name="title" value={basics.title} onChange={handleBasicsChange} required
                placeholder="e.g. Help rebuild after flood" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select name="category" value={basics.category} onChange={handleBasicsChange} className={inputCls}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Funding Goal (INR) *</label>
              <input name="goalAmount" type="number" min="1" value={basics.goalAmount}
                onChange={handleBasicsChange} placeholder="500000" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deadline *</label>
              <input name="deadline" type="date" value={basics.deadline}
                onChange={handleBasicsChange} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input name="location" value={basics.location} onChange={handleBasicsChange}
                placeholder="e.g. Mumbai, India" className={inputCls} />
            </div>
          </div>
        )}

        {/* Step 2: Story */}
        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tell Your Story *</label>
            <p className="text-sm text-gray-400 mb-3">Explain why you need funding and how donations will help.</p>
            <textarea
              value={story.description}
              onChange={(e) => setStory({ description: e.target.value })}
              rows={10}
              placeholder="Share your campaign story..."
              className={`${inputCls} resize-vertical`}
            />
          </div>
        )}

        {/* Step 3: Images */}
        {step === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Images</label>
            <p className="text-sm text-gray-400 mb-3">Upload up to 5 images from your device (JPG, PNG, etc.)</p>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-emerald-300 rounded-xl cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-colors">
              <span className="text-3xl mb-1">🖼️</span>
              <span className="text-sm font-medium text-emerald-600">Click to select images</span>
              <span className="text-xs text-gray-400 mt-1">{images.length}/5 selected</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageAdd} disabled={images.length >= 5} />
            </label>
            <FilePreview files={images} isImage onRemove={(i) => setImages((p) => p.filter((_, idx) => idx !== i))} />
          </div>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents</label>
            <p className="text-sm text-gray-400 mb-3">Upload medical reports, ID proof, or any supporting files (PDF, DOC, etc.)</p>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors">
              <span className="text-3xl mb-1">📁</span>
              <span className="text-sm font-medium text-blue-600">Click to select documents</span>
              <span className="text-xs text-gray-400 mt-1">{documents.length}/5 selected</span>
              <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.png" className="hidden" onChange={handleDocAdd} disabled={documents.length >= 5} />
            </label>
            <FilePreview files={documents} isImage={false} onRemove={(i) => setDocuments((p) => p.filter((_, idx) => idx !== i))} />
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700">Basics</h3>
                <button onClick={() => setStep(1)} className="text-xs text-emerald-600 hover:underline">Edit</button>
              </div>
              <p><span className="text-gray-500 text-sm">Title:</span> <span className="font-medium">{basics.title}</span></p>
              <p><span className="text-gray-500 text-sm">Category:</span> <span className="font-medium capitalize">{basics.category}</span></p>
              <p><span className="text-gray-500 text-sm">Goal:</span> <span className="font-medium">₹{Number(basics.goalAmount).toLocaleString("en-IN")}</span></p>
              <p><span className="text-gray-500 text-sm">Deadline:</span> <span className="font-medium">{basics.deadline}</span></p>
              {basics.location && <p><span className="text-gray-500 text-sm">Location:</span> <span className="font-medium">{basics.location}</span></p>}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700">Story</h3>
                <button onClick={() => setStep(2)} className="text-xs text-emerald-600 hover:underline">Edit</button>
              </div>
              <p className="text-sm text-gray-600 line-clamp-4">{story.description || <span className="text-gray-400 italic">No description</span>}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700">Images</h3>
                <button onClick={() => setStep(3)} className="text-xs text-emerald-600 hover:underline">Edit</button>
              </div>
              {images.length ? (
                <div className="flex gap-2 flex-wrap">
                  {images.map((f, i) => (
                    <img key={i} src={URL.createObjectURL(f)} className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400 italic">No images added</p>}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700">Documents</h3>
                <button onClick={() => setStep(4)} className="text-xs text-emerald-600 hover:underline">Edit</button>
              </div>
              {documents.length ? (
                <ul className="text-sm text-gray-600 space-y-1">
                  {documents.map((f, i) => <li key={i}>📄 {f.name}</li>)}
                </ul>
              ) : <p className="text-sm text-gray-400 italic">No documents added</p>}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button onClick={back} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all">
              ← Back
            </button>
          ) : <div />}

          {step < 5 ? (
            <button
              onClick={next}
              disabled={
                (step === 1 && (!basics.title || !basics.goalAmount || !basics.deadline)) ||
                (step === 2 && !story.description)
              }
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 transition-all"
            >
              {submitting ? "Uploading & Creating..." : "🚀 Launch Campaign"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RaiseFund;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/RaiseFund.jsx
git commit -m "feat: replace flat form with 5-step campaign creation wizard"
```
