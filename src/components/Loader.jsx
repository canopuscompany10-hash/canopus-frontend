// src/components/Loader.jsx
import React from "react";
import { motion } from "framer-motion";
import demoIcon from "../assets/homeimage.jpg"; // Demo image

function Loader() {
  return (
    <div className="fixed inset-0 bg-red-500 flex items-center justify-center z-50">
      <div className="relative w-32 h-32">
        {/* Spinning circle */}
        <motion.div
          className="absolute inset-0 border-4 border-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        {/* Center icon */}
        <img
          src={demoIcon}
          alt="Logo"
          className="w-16 h-16 object-cover rounded-full relative z-10"
        />
      </div>
    </div>
  );
}

export default Loader;
