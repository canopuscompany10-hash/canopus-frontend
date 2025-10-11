import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "about" },
    { name: "Service", path: "services" },
    { name: "Menu", path: "menu" },
    { name: "Gallery", path: "gallery" },
    { name: "Reviews", path: "reviews" },
    { name: "Contact", path: "contact" },
  ];

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMenuOpen(false);
    }
  };

  const handleProfileClick = () => {
    if (user?.role === "admin"  || user.role === "superadmin") {
      navigate("/dashboard");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 shadow-md ${
        scrolled ? "bg-white text-red-500" : "bg-red-500 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6 md:px-10">
        {/* Logo */}
        <motion.h1
          className="kaushan-script-regular text-2xl md:text-3xl tracking-wide"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Canopus Company
        </motion.h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 text-lg font-medium">
          {navLinks.map((link) =>
            link.path.startsWith("/") ? (
              <Link key={link.name} to={link.path}>
                {link.name}
              </Link>
            ) : (
              <button
                key={link.name}
                onClick={() => handleScrollTo(link.path)}
                className={`transition-colors ${
                  scrolled
                    ? "hover:text-amber-500 text-red-500"
                    : "hover:text-amber-300 text-white"
                }`}
              >
                {link.name}
              </button>
            )
          )}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={handleProfileClick}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 bg-white"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-red-500 font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-semibold">{user.name}</span>
            </div>
          ) : (
            <Link to="/login">
              <button
                className={`font-semibold py-2 px-6 rounded-full transition-all duration-300 ${
                  scrolled
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white text-red-500 hover:bg-gray-100"
                }`}
              >
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          {menuOpen ? (
            <X size={28} onClick={toggleMenu} className="cursor-pointer" />
          ) : (
            <Menu size={28} onClick={toggleMenu} className="cursor-pointer" />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.nav
          className={`md:hidden flex flex-col items-center space-y-6 py-6 transition-colors duration-300 ${
            scrolled ? "bg-white text-red-500" : "bg-red-500 text-white"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {navLinks.map((link) =>
            link.path.startsWith("/") ? (
              <Link key={link.name} to={link.path} onClick={toggleMenu}>
                {link.name}
              </Link>
            ) : (
              <button
                key={link.name}
                onClick={() => handleScrollTo(link.path)}
                className={`text-lg transition-colors ${
                  scrolled
                    ? "hover:text-amber-500 text-red-500"
                    : "hover:text-amber-300 text-white"
                }`}
              >
                {link.name}
              </button>
            )
          )}

          {user ? (
            <div
              className="flex flex-col items-center space-y-2 cursor-pointer"
              onClick={() => {
                toggleMenu();
                if (user.role === "admin" || user.role === "superadmin") {
                  navigate("/dashboard");
                }
              }}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-14 h-14 rounded-full border-2 border-amber-400"
                />
              ) : (
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-red-500 text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-semibold">{user.name}</span>
            </div>
          ) : (
            <Link to="/login">
              <button
                onClick={toggleMenu}
                className={`font-semibold py-2 px-6 rounded-full transition-all duration-300 ${
                  scrolled
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white text-red-500 hover:bg-gray-100"
                }`}
              >
                Login
              </button>
            </Link>
          )}
        </motion.nav>
      )}
    </header>
  );
}

export default Header;
