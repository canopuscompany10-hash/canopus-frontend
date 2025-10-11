import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  const navigate = useNavigate();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "menu" },
    { name: "About Us", path: "about" },
    { name: "Contact", path: "whatsapp" }, 
  ];

  const services = [
    { name: "Weddings", path: "/weddings" },
    { name: "Corporate Events", path: "/corporate-events" },
    { name: "Birthday Parties", path: "/birthday-parties" },
  ];

  const whatsappNumber = "9744850680"; 

  const handleClick = (link) => {
    if (link.path === "whatsapp") {
      // Open WhatsApp
      window.open(
        `https://wa.me/${whatsappNumber}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else if (link.path.startsWith("/")) {
      // SPA navigation
      navigate(link.path);
      // Optional: smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Fallback scroll for IDs like #menu or #about
      const el = document.getElementById(link.path.replace("/", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <footer id="contact" className="bg-red-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row md:justify-between items-center md:items-start gap-10">
        {/* Branding */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold kaushan-script-regular">
            Canopus Catering
          </h1>
          <p className="mt-2 text-gray-200 text-sm md:text-base">
            Premium catering for weddings, parties, and special events.
          </p>
        </div>

        {/* Quick Links & Services */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-center md:text-left">
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name} className="text-sm md:text-base">
                  <button
                    onClick={() => handleClick(link)}
                    className="hover:text-yellow-400 transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name} className="text-sm md:text-base">
                  <Link
                    to={service.path}
                    className="hover:text-yellow-400 transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 mt-6 md:mt-0 justify-center">
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
