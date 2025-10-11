// src/components/Loader.jsx
import React from "react";
import { motion } from "framer-motion";
import demoIcon from "../assets/homeimage.jpg";

function Loader() {
  return (
    <div className="fixed inset-0 bg-red-500 flex items-center justify-center z-50">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Spinning ring */}
        <motion.div
          className="absolute w-32 h-32 border-4 border-t-white border-b-transparent border-l-transparent border-r-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }} 
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
