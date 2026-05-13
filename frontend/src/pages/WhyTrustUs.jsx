import { motion } from "framer-motion";
import { FaShieldAlt, FaHandHoldingHeart, FaUsers, FaChartLine, FaLock, FaGlobe } from "react-icons/fa";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

function WhyTrustUs() {
  const reasons = [
    {
      icon: <FaShieldAlt size={28} />,
      title: "Verified Campaigns",
      description: "Every campaign is reviewed and approved by our admin team before going live, ensuring legitimacy and accountability.",
    },
    {
      icon: <FaLock size={28} />,
      title: "Secure Payments",
      description: "All transactions are processed through Razorpay with bank-grade encryption. Your financial data is never stored on our servers.",
    },
    {
      icon: <FaHandHoldingHeart size={28} />,
      title: "100% Transparent",
      description: "Track every donation in real-time. See exactly how much has been raised and where the funds are going.",
    },
    {
      icon: <FaUsers size={28} />,
      title: "Community Driven",
      description: "Built by people who care. Our platform connects donors directly with those in need — no middlemen.",
    },
    {
      icon: <FaChartLine size={28} />,
      title: "Proven Impact",
      description: "Thousands of campaigns successfully funded. From medical emergencies to education — real lives changed.",
    },
    {
      icon: <FaGlobe size={28} />,
      title: "Accessible to All",
      description: "Anyone can start a campaign or donate. No barriers, no hidden fees — just a platform that works for everyone.",
    },
  ];

  const successStories = [
    {
      name: "Anita Sharma",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      story: "My father needed an urgent heart surgery and we had no way to afford it. Within 5 days of creating a campaign on CrowdFund, we raised over 8 lakhs. The doctors were amazed, but more importantly, my father is alive and healthy today. I can never thank this platform and its donors enough.",
      raised: "8,50,000",
      category: "Medical",
    },
    {
      name: "Rahul Verma",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      story: "Coming from a small village in UP, I never thought I could afford to study engineering. A teacher helped me create a campaign here and the response was overwhelming. Strangers believed in my dream. I'm now in my final year at NIT and I mentor other students from my village.",
      raised: "3,20,000",
      category: "Education",
    },
    {
      name: "Sneha Patel",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      story: "Our community needed a clean water facility desperately. Government help was slow, so we turned to CrowdFund. In just 3 weeks, 400+ donors helped us raise enough to build a water purification plant that now serves 2,000 families daily.",
      raised: "12,00,000",
      category: "Community",
    },
    {
      name: "Dr. Meera Krishnan",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      story: "I run a small NGO for stray animal rescue. Funding was always our biggest challenge. Through CrowdFund, we've run 6 successful campaigns, saved over 200 animals, and built a proper shelter. The transparency of the platform built trust with our donors.",
      raised: "5,40,000",
      category: "Animals",
    },
  ];

  const testimonials = [
    {
      name: "Vikram Joshi",
      role: "Donor",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      message: "I've donated to 15+ campaigns on CrowdFund. What I love most is the transparency — I can see exactly where my money goes and get updates from campaign creators.",
    },
    {
      name: "Priya Menon",
      role: "Campaign Creator",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      message: "The approval process gave my donors confidence that my campaign was genuine. The platform made fundraising simple and stress-free.",
    },
    {
      name: "Arjun Reddy",
      role: "Donor",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      message: "Secure payments, real campaigns, and real impact. CrowdFund is the only platform I trust for my charitable giving.",
    },
    {
      name: "Kavitha Nair",
      role: "Campaign Creator",
      image: "https://randomuser.me/api/portraits/women/52.jpg",
      message: "When my son was diagnosed with a rare condition, CrowdFund became our lifeline. The community here is incredibly generous and kind.",
    },
    {
      name: "Sameer Khan",
      role: "Donor",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      message: "I appreciate that every campaign is verified before going live. It gives me peace of mind knowing my donation reaches the right people.",
    },
    {
      name: "Deepa Gupta",
      role: "Campaign Creator",
      image: "https://randomuser.me/api/portraits/women/71.jpg",
      message: "Raised funds for our school's computer lab in just 10 days. The share feature helped us reach donors we never could have found on our own.",
    },
  ];

  return (
    <div className="pt-24">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Why Trust CrowdFund?</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            We believe in transparency, security, and real impact. Here's why thousands of people choose us.
          </p>
        </motion.div>
      </section>

      {/* Trust Reasons */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Sets Us Apart</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Success Stories</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Real people. Real campaigns. Real impact.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{story.name}</h3>
                      <span className="text-sm px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                        {story.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">"{story.story}"</p>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <span className="text-2xl">₹{story.raised}</span>
                    <span className="text-sm text-gray-400 font-normal">raised successfully</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">What People Say</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Hear from our donors and campaign creators.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <p className="text-gray-600 mb-4 leading-relaxed">"{t.message}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "1,000+", label: "Campaigns Funded" },
            { number: "50,000+", label: "Donors" },
            { number: "₹10Cr+", label: "Raised" },
            { number: "99.9%", label: "Satisfaction" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-black text-emerald-400">{stat.number}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default WhyTrustUs;
