import React from "react";

function Testimonials() {

  const testimonials = [
    {
      id: 1,
      name: "Anita Sharma",
      message: "Thanks to this platform, we raised funds for my father's surgery in just 5 days.",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      id: 2,
      name: "Rahul Verma",
      message: "The support from donors was overwhelming. This platform helped my education dream come true.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "Sneha Patel",
      message: "Raising funds for our community project became easy and transparent.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  return (
    <div className="py-12">

      <h2 className="text-3xl font-bold text-center mb-8">
        What People Are Saying
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white p-6 rounded-lg shadow"
          >

            <div className="flex items-center mb-4">

              <img
                src={t.image}
                alt={t.name}
                className="w-12 h-12 rounded-full mr-3"
              />

              <h3 className="font-semibold">
                {t.name}
              </h3>

            </div>

            <p className="text-gray-600">
              "{t.message}"
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Testimonials;