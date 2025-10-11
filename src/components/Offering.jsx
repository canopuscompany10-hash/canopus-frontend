import React from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed, Users, Star, Coffee, Gift } from "lucide-react";

function Offering() {
  const offerings = [
    {
      icon: <UtensilsCrossed size={50} className="text-red-600" />,
      title: "Premium Tableware",
      desc: "Elegant plates, spoons, and bowls — crafted for luxury service.",
    },
    {
      icon: <Users size={50} className="text-red-600" />,
      title: "Catering Staff",
      desc: "Polite and professional staff ensuring smooth service.",
    },
    {
      icon: <Star size={50} className="text-red-600" />,
      title: "Delicious Foods",
      desc: "A perfect blend of traditional and modern flavors.",
    },
    {
      icon: <Coffee size={50} className="text-red-600" />,
      title: "Beverages",
      desc: "Refreshing drinks, mocktails, and premium coffee service.",
    },
    {
      icon: <Gift size={50} className="text-red-600" />,
      title: "Event Essentials",
      desc: "Complete setup for luxury and memorable experiences.",
    },
  ];

  return (
    <div
      id="offering"
      className="bg-white overflow-hidden py-20 px-6 md:px-16 text-gray-800"
    >
      <motion.h2
        className="kaushan-script-regular text-4xl md:text-5xl text-center text-red-600 mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        What We Offer
      </motion.h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
        {offerings.map((item, index) => (
          <motion.div
            key={index}
            className="bg-red-50 p-6 rounded-2xl shadow-md hover:shadow-xl text-center flex flex-col justify-center items-center h-full min-h-[260px] transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.15 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex flex-col items-center">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Offering;
