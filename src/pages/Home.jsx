import { motion } from "framer-motion";
import About from "../components/About";
import Service from "../components/Service";
import Menu from "../components/Menu";
import Offering from "../components/Offering";
import Ratings from "../components/Ratings";
import Gallery from "../components/Gallery";
import Footer from "../components/Footer";
import homeimage from "../assets/homeimage.jpg";

function Home() {
  // Access WhatsApp number from env
const whatsappNumber = 9744850680

  const handleBookingClick = () => {
    if (!whatsappNumber) {
      alert("WhatsApp number is not set in environment variables!");
      return;
    }
    const message = encodeURIComponent(
      "Hello Canopus! I would like to book your catering services."
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <>
      {/* HERO SECTION */}
      <div className="w-[100%] min-h-[100vh] bg-red-500 flex flex-col md:flex-row items-center justify-center px-6 md:px-16 overflow-hidden pt-24">
        {/* LEFT SIDE — Text Section */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col items-start justify-center text-left space-y-6"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="kaushan-script-regular text-4xl md:text-6xl text-white leading-snug">
            Book <span className="text-gray-200">Canopus</span> for your
            <br /> Dream Event.
          </h1>

          <p className="text-gray-100 text-lg md:text-xl max-w-md leading-relaxed">
            Experience premium catering services with elegance and flavor — from
            tableware to staff and gourmet dishes. We bring luxury and
            perfection to every celebration.
          </p>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookingClick}
            className="bg-white text-red-600 font-semibold py-3 px-8 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
          >
            Book Now
          </motion.button>
        </motion.div>

        {/* RIGHT SIDE — Image Composition */}
        <motion.div
          className="w-full md:w-1/2 flex items-center justify-center relative mt-10 md:mt-0"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col items-center">
            <img
              src={homeimage}
              alt="Catering Top"
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-lg border-4 border-white mb-4 hover:scale-105 transition-transform duration-500"
            />
            <img
              src={homeimage}
              alt="Catering Center"
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl shadow-2xl z-10 border-4 border-white mb-4 hover:scale-105 transition-transform duration-500"
            />
            <img
              src={homeimage}
              alt="Catering Bottom"
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-lg border-4 border-white hover:scale-105 transition-transform duration-500"
            />
          </div>
          <img
            src={homeimage}
            alt="Catering Left"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 object-cover rounded-xl shadow-lg border-4 border-white hover:scale-105 transition-transform duration-500"
          />
          <img
            src={homeimage}
            alt="Catering Right"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 object-cover rounded-xl shadow-lg border-4 border-white hover:scale-105 transition-transform duration-500"
          />
        </motion.div>
      </div>

      {/* NEXT SECTIONS */}
      <About />
      <Service />
      <Menu />
      <Offering />
      <Ratings />
      <Gallery />
      <Footer />
    </>
  );
}

export default Home;
