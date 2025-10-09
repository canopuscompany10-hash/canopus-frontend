import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

function Footer() {
  return (
    <footer id="contact" className="bg-red-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-0">
        {/* Branding */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold kaushan-script-regular">
            Canopus Catering
          </h1>
          <p className="mt-2 text-gray-200 text-sm md:text-base">
            Premium catering for weddings, parties, and special events.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-center md:text-left flex-1">
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Menu", "About Us", "Contact"].map((link) => (
                <li
                  key={link}
                  className="hover:text-yellow-400 cursor-pointer transition-colors text-sm md:text-base"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2">
              {["FAQ", "Privacy Policy", "Terms of Service"].map((link) => (
                <li
                  key={link}
                  className="hover:text-yellow-400 cursor-pointer transition-colors text-sm md:text-base"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 mt-6 md:mt-0 flex-wrap justify-center md:justify-start">
          {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
            (Icon, index) => (
              <a
                key={index}
                href="#"
                className="p-3 bg-white text-red-600 rounded-full hover:bg-yellow-400 hover:text-white transition-all transform hover:scale-110"
              >
                <Icon />
              </a>
            )
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-200 mt-8 text-xs md:text-sm">
        &copy; {new Date().getFullYear()} Canopus Catering. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
