import React from "react";
import Testimonials from "../components/Testimonials/Testimonials";

function TrustUs() {
  const successStories = [
    {
      id: 1,
      title: "Rebuilding a Local Library",
      description: "After a fire destroyed the community library, the local community came together to raise ₹5,00,000 in just two weeks to restore the building and replace the books.",
      category: "Education",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Saving Life of Little Aryan",
      description: "2-year-old Aryan needed urgent heart surgery. With the help of 1200+ donors, we raised ₹12,00,000 for his medical expenses. He is now recovering and healthy.",
      category: "Medical",
      image: "https://images.unsplash.com/photo-1505751172107-573225a94501?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Clean Water for Vidarbha",
      description: "A group of students raised ₹3,00,000 to install 10 solar-powered water pumps in drought-affected villages, providing clean water to over 500 families.",
      category: "Environment",
      image: "https://images.unsplash.com/photo-1541810271594-733993424731?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Why to Trust Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We are committed to transparency, security, and making sure your donations reach those who need it most.
        </p>
      </div>

      {/* Trust Pillars */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="text-center p-6 border rounded-xl bg-emerald-50">
          <div className="text-emerald-600 text-4xl mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Verified Campaigns</h3>
          <p className="text-gray-600">Every campaign goes through a multi-step verification process before going live.</p>
        </div>
        <div className="text-center p-6 border rounded-xl bg-teal-50">
          <div className="text-teal-600 text-4xl mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">100% Transparency</h3>
          <p className="text-gray-600">Real-time tracking of funds and direct disbursement to the cause.</p>
        </div>
        <div className="text-center p-6 border rounded-xl bg-emerald-50">
          <div className="text-teal-700 text-4xl mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Community Driven</h3>
          <p className="text-gray-600">Trusted by over 10,000+ donors and hundreds of successful causes.</p>
        </div>
      </div>

      {/* Success Stories */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-10">Impact of Your Support</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story) => (
            <div key={story.id} className="overflow-hidden rounded-xl shadow-lg border">
              <img src={story.image} alt={story.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">{story.category}</span>
                <h3 className="text-xl font-bold mt-2 mb-3">{story.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{story.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 rounded-3xl px-8 py-4">
        <Testimonials />
      </div>
    </div>
  );
}

export default TrustUs;
