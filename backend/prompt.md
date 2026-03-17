Schema
{
 _id: ObjectId,


 name: String,


 email: {
   type: String,
   unique: true
 },


 passwordHash: String,


 role: {
   type: String,
   enum: ["user","admin"],
   default: "user"
 },


 phone: String,


 avatar: String,


 location: {
   city: String,
   state: String,
   country: String
 },


 isVerified: {
   type: Boolean,
   default: false
 },


 stats: {
   campaignsCreated: Number,
   totalDonated: Number,
   totalRaised: Number
 },


 createdAt: Date,
 updatedAt: Date
}


Why these fields exist
name
Display on:
profile
comments
donations


email
Needed for:
login
notifications
invoices
password reset

Unique index required.

passwordHash
Never store passwords.
Use:
bcrypt


role
Needed for:
admin panel
approval system


phone
Needed because fundraising requires verification.

avatar
Used in:
profile circle
comments
donation list


location
Display on campaign page:
Who is raising funds
From where


stats
Helps avoid expensive DB queries.
Example:
User dashboard


6. Campaign Schema
Collection:
campaigns

{
 _id: ObjectId,


 creatorId: ObjectId,


 title: String,


 description: String,


 category: String,


 goalAmount: Number,


 raisedAmount: {
   type: Number,
   default: 0
 },


 donorCount: {
   type: Number,
   default: 0
 },


 images: [String],


 documents: [String],


 location: String,


 status: {
   type: String,
   enum: [
     "draft",
     "pending",
     "approved",
     "rejected",
     "completed"
   ]
 },


 adminNote: String,


 deadline: Date,


 createdAt: Date
}


Why admin approval?
Flow:
User creates campaign
        ↓
status = pending
        ↓
Admin approves
        ↓
status = approved
        ↓
Visible in donate page


7. Donation Schema
Collection:
donations

{
 _id: ObjectId,


 donorId: ObjectId,


 campaignId: ObjectId,


 amount: Number,


 paymentId: String,


 paymentGateway: "razorpay",


 paymentStatus: {
   type: String,
   enum: [
     "pending",
     "completed",
     "failed"
   ]
 },


 message: String,


 isAnonymous: Boolean,


 createdAt: Date
}
create a folder named models and ad the above schema it should be acessible in. mongodb aatlas
