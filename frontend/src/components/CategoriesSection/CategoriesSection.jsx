import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHeartbeat, FaGraduationCap, FaHandHoldingHeart, FaDog, FaSeedling, FaLightbulb, FaUsers, FaExclamationTriangle } from "react-icons/fa";

function CategoriesSection() {
  const categories = [
    { name: "Medical", value: "medical", icon: <FaHeartbeat size={30} />, color: "bg-emerald-100 text-emerald-700" },
    { name: "Education", value: "education", icon: <FaGraduationCap size={30} />, color: "bg-teal-100 text-teal-700" },
    { name: "NGO", value: "ngo", icon: <FaHandHoldingHeart size={30} />, color: "bg-emerald-50 text-emerald-600" },
    { name: "Animals", value: "animals", icon: <FaDog size={30} />, color: "bg-teal-50 text-teal-600" },
    { name: "Community", value: "community", icon: <FaUsers size={30} />, color: "bg-emerald-200 text-emerald-800" },
    { name: "Emergency", value: "emergency", icon: <FaExclamationTriangle size={30} />, color: "bg-teal-200 text-teal-800" },
    { name: "Business", value: "business", icon: <FaSeedling size={30} />, color: "bg-emerald-100 text-emerald-600" },
    { name: "Technology", value: "technology", icon: <FaLightbulb size={30} />, color: "bg-teal-100 text-teal-600" },
  ];

  return (
    <div className="py-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
        {categories.map((category) => (
          <Link key={category.value} to={`/donate?category=${category.value}`}>
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-md cursor-pointer ${category.color}`}
            >
              <div className="mb-3">{category.icon}</div>
              <h3 className="font-semibold text-sm">{category.name}</h3>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoriesSection;
