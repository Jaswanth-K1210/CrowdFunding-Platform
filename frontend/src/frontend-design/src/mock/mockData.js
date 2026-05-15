export const MOCK_CAMPAIGNS = [
  {
    _id: "c1", title: "Help rebuild our school library after the floods",
    description: "Our school in rural Assam was devastated by the 2024 floods. The library — home to 4,000 books — was completely destroyed. We are fundraising to rebuild it and give 600 children access to education again.\n\nThe funds will be used to:\n• Rebuild the physical structure (₹8 lakhs)\n• Restock books and materials (₹4 lakhs)\n• Digital learning tablets (₹3 lakhs)\n\nEvery rupee you give goes directly to the children of Majuli.",
    category: "education", goalAmount: 1500000, raisedAmount: 1120000,
    donorCount: 342, deadline: new Date(Date.now() + 12 * 86400000).toISOString(),
    status: "approved", location: "Majuli, Assam",
    images: ["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80"],
    documents: [], creatorId: { name: "Priya Sharma" },
  },
  {
    _id: "c2", title: "Life-saving surgery for 8-year-old Arjun",
    description: "Arjun was diagnosed with a congenital heart defect that requires immediate open-heart surgery. His family — daily wage labourers from Varanasi — cannot afford the ₹6 lakh surgery cost.\n\nThe surgery is scheduled at AIIMS Delhi. Without intervention in the next 30 days, Arjun's condition will deteriorate.\n\nAll funds are managed by the hospital trust and disbursed directly to the hospital.",
    category: "medical", goalAmount: 600000, raisedAmount: 487000,
    donorCount: 218, deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
    status: "approved", location: "Varanasi, UP",
    images: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"],
    documents: [], creatorId: { name: "Sunita Devi" },
  },
  {
    _id: "c3", title: "Clean water for 2,000 families in Rajasthan",
    description: "The villages of Barmer district have been walking 8km daily for water for decades. We are building a community pipeline and water treatment plant to change this forever.",
    category: "community", goalAmount: 2000000, raisedAmount: 1680000,
    donorCount: 891, deadline: new Date(Date.now() + 45 * 86400000).toISOString(),
    status: "approved", location: "Barmer, Rajasthan",
    images: ["https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80"],
    documents: [], creatorId: { name: "Ramesh Patel" },
  },
  {
    _id: "c4", title: "Feed 500 stray dogs in Bangalore this winter",
    description: "With temperatures dropping, thousands of stray dogs in Bangalore are at risk. Our shelter needs funds for food, blankets, and veterinary care through the winter months.",
    category: "animals", goalAmount: 250000, raisedAmount: 89000,
    donorCount: 67, deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: "approved", location: "Bangalore, Karnataka",
    images: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80"],
    documents: [], creatorId: { name: "Anitha Nair" },
  },
  {
    _id: "c5", title: "Women entrepreneurs — seed funding for 50 small businesses",
    description: "We are providing zero-interest micro-loans to 50 women entrepreneurs in rural Maharashtra. From weaving cooperatives to vegetable farming, these women need just ₹10,000–20,000 each to change their lives.",
    category: "business", goalAmount: 1000000, raisedAmount: 430000,
    donorCount: 156, deadline: new Date(Date.now() + 60 * 86400000).toISOString(),
    status: "approved", location: "Pune, Maharashtra",
    images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80"],
    documents: [], creatorId: { name: "Dr. Meera Joshi" },
  },
  {
    _id: "c6", title: "Cyclone relief: rebuild 200 homes in Odisha",
    description: "Cyclone Dana wiped out entire villages in Balasore, Odisha. Families are sleeping under open skies. Emergency funds are needed to provide tarpaulins, temporary shelters, and food kits.",
    category: "emergency", goalAmount: 5000000, raisedAmount: 2100000,
    donorCount: 1204, deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    status: "approved", location: "Balasore, Odisha",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
    documents: [], creatorId: { name: "NGO Samarpan" },
  },
  {
    _id: "c7", title: "Solar-powered internet kiosks for 10 tribal villages",
    description: "Ten tribal villages in Jharkhand have zero internet connectivity. We are setting up solar-powered community kiosks with broadband access, enabling children to access online education.",
    category: "technology", goalAmount: 3000000, raisedAmount: 780000,
    donorCount: 94, deadline: new Date(Date.now() + 90 * 86400000).toISOString(),
    status: "approved", location: "Ranchi, Jharkhand",
    images: ["https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"],
    documents: [], creatorId: { name: "Tech4Good India" },
  },
  {
    _id: "c8", title: "Plant 10,000 trees across Delhi NCR this monsoon",
    description: "Delhi's AQI is a national emergency. Our NGO is partnering with municipalities to plant 10,000 native trees across Delhi NCR during the 2025 monsoon season.",
    category: "ngo", goalAmount: 800000, raisedAmount: 312000,
    donorCount: 203, deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
    status: "approved", location: "Delhi NCR",
    images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80"],
    documents: [], creatorId: { name: "Green Delhi Foundation" },
  },
];

export const MOCK_DONATIONS = [
  { _id: "d1", campaignId: { _id: "c3", title: "Clean water for 2,000 families in Rajasthan", images: [] }, amount: 2500, paymentStatus: "completed", createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), isAnonymous: false, donorId: { name: "You" } },
  { _id: "d2", campaignId: { _id: "c2", title: "Life-saving surgery for 8-year-old Arjun",     images: [] }, amount: 1000, paymentStatus: "completed", createdAt: new Date(Date.now() - 8 * 86400000).toISOString(), isAnonymous: false, donorId: { name: "You" } },
  { _id: "d3", campaignId: { _id: "c6", title: "Cyclone relief: rebuild 200 homes in Odisha",   images: [] }, amount: 5000, paymentStatus: "completed", createdAt: new Date(Date.now() - 15 * 86400000).toISOString(), isAnonymous: true },
];

export const MOCK_USER = {
  _id: "u1", name: "Jaswanth K", email: "jaswanth@example.com", role: "user",
};

export const MOCK_CAMPAIGN_DONORS = [
  { _id: "r1", donorId: { name: "Anitha R." }, amount: 2500, isAnonymous: false, message: "Stay strong, little one!" },
  { _id: "r2", donorId: { name: "Rohan M." }, amount: 1000, isAnonymous: false, message: "" },
  { _id: "r3", isAnonymous: true, amount: 5000, message: "Prayers for the family" },
  { _id: "r4", donorId: { name: "Priya T." }, amount: 500, isAnonymous: false, message: "" },
  { _id: "r5", isAnonymous: true, amount: 10000, message: "" },
];
