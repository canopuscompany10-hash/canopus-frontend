import React from "react";
import { motion } from "framer-motion";

// Example images (replace with your actual images)
import weddingImg from "../assets/weddingImg.jpeg";
import cateringTeamImg from "../assets/cateringTeam.jpg";
import beveragesImg from "../assets/beverages.webp";

function Service() {
  const events = [
    {
      title: "Weddings",
      desc: "We craft unforgettable wedding experiences with premium catering, elegant décor, and impeccable service, making your special day perfect. Our wedding packages include customized menus, beautifully presented platters, skilled staff, and seamless coordination so that every moment is memorable. From intimate ceremonies to grand receptions, we ensure your celebration is luxurious, stylish, and stress-free.",
      img: weddingImg,
      reverse: false,
    },
    {
      title: "Catering Team & Beverages",
      desc: "Our professional catering team ensures smooth service, offering a wide range of premium beverages for your guests. We provide trained waitstaff, bar service, and live beverage stations for cocktails, mocktails, coffees, and teas. Whether it’s a private gathering or corporate event, our team guarantees timely service and attentive hospitality for a flawless experience.",
      img: cateringTeamImg,
      reverse: true,
    },
    {
      title: "Beverages & Rentals",
      desc: "We provide premium drinks, mocktails, and coffee along with event rentals — tables, chairs, linens, and elegant setups for a flawless experience. Our inventory includes stylish décor items, lighting, glassware, and cutlery to enhance the overall ambiance. Perfect for any event, our beverages and rentals ensure comfort, elegance, and convenience for you and your guests.",
      img: beveragesImg,
      reverse: false,
    },
  ];

  return (
    <div id="services" className="bg-gray-100 overflow-hidden py-20 px-6 md:px-16 text-red-600">
      <motion.h2
        className="kaushan-script-regular text-4xl md:text-5xl text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Our Services
      </motion.h2>

      <div className="flex flex-col space-y-20 max-w-7xl mx-auto">
        {events.map((event, index) => (
          <motion.div
            key={index}
            className={`flex flex-col lg:flex-row items-center justify-between gap-10 ${
              event.reverse ? "lg:flex-row-reverse" : ""
            }`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.3 }}
          >
            {/* Image */}
            <div className="w-full lg:w-1/2">
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Text */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-semibold mb-6">
                {event.title}
              </h3>
              <p className="text-lg md:text-xl leading-relaxed">{event.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Service;
