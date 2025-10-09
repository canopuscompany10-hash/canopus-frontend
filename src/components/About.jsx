import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

import tableware from "../assets/tableware.jpg";
import staff from "../assets/staff.webp";
import food from "../assets/food.webp";
// a
function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div
      id="about"
      className="bg-white overflow-hidden text-red-700 min-h-screen py-20 px-6 md:px-16"
    >
      {/* HEADING ON TOP */}
      <motion.h2
        className="kaushan-script-regular text-4xl md:text-5xl text-center mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Us
      </motion.h2>

      {/* QUOTE BELOW HEADING */}
      <motion.p
        className="text-center text-lg italic mb-12 tracking-wide text-red-500"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        “We’re the ones who make premium catering feel truly unforgettable.”
      </motion.p>

      {/* CONTENT SECTION (IMAGES + TEXT) */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* LEFT SIDE IMAGES */}
        <motion.div
          className="grid grid-cols-2 gap-4 w-full lg:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={tableware}
            alt="Tableware"
            className="w-full h-64 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform duration-500 col-span-2"
          />
          <img
            src={staff}
            alt="Staff"
            className="w-full h-48 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform duration-500"
          />
          <img
            src={food}
            alt="Food"
            className="w-full h-48 object-cover rounded-2xl shadow-md hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        {/* RIGHT SIDE TEXT */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg leading-relaxed mb-6 text-gray-800">
            Welcome to{" "}
            <span className="font-semibold text-red-700">Canopus Company</span>,
            where we take pride in offering premium catering services that blend
            exquisite taste, elegant presentation, and top-tier hospitality.
          </p>
          <p className="text-lg leading-relaxed mb-6 text-gray-800">
            We specialize in crafting memorable culinary experiences — from
            beverages and buffet spreads to grand celebrations and corporate
            events. Every dish we prepare reflects our passion for perfection
            and dedication to quality.
          </p>
          <p className="text-lg leading-relaxed text-gray-800">
            Our mission is simple: to bring a touch of luxury and authenticity
            to your special occasions. Whether it’s an intimate gathering or a
            lavish event, we ensure every guest enjoys an unforgettable dining
            experience.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default About;
