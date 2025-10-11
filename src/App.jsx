import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserProvider } from "./context/UserContext";
import { WorkProvider } from "./context/WorkContext";
import { MenuProvider } from "./context/MenuContext";
import { GalleryProvider } from "./context/GalleryContext";

import AppWrapper from "./AppWrapper";
import Header from "./components/Header";
import Loader from "./components/Loader";

// SEO Handler
function SEOHandler() {
  const location = useLocation();

  useEffect(() => {
    let title = "Catering Canopus | Smart Catering Management";
    let description =
      "Manage catering projects, menus, and staff effortlessly with Catering Canopus.";

    if (location.pathname === "/") {
      title = "Home | Catering Canopus";
      description =
        "Welcome to Catering Canopus — manage your catering services with ease.";
    
    } else if (location.pathname.includes("/dashboard")) {
      title = "Dashboard | Catering Canopus";
      description =
        "View your catering projects, works, and performance insights.";
    } else if (location.pathname.includes("/login")) {
      title = "Login | Catering Canopus";
      description =
        "Login to your Catering Canopus account to manage your operations.";
    }

// else if (location.pathname.includes("/offerings")) {
//       title = "Offerings | Catering Canopus";
//       description =
//         "Explore our diverse catering offerings and packages for every occasion.";


    document.title = title;

    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.name = "description";
      document.head.appendChild(descTag);
    }
    descTag.setAttribute("content", description);
  }, [location]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Demo loader: hide after 1.5s
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Hide header on login and dashboard
  const noHeaderRoutes = ["/login", "/dashboard"];
  const hideHeader = noHeaderRoutes.some((route) =>
    location.pathname.includes(route)
  );

  if (loading) return <Loader />;

  return (
    <>
      <SEOHandler />
      {!hideHeader && <Header />}
      <AppWrapper />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <WorkProvider>
          <MenuProvider>
            <GalleryProvider>
              <AppContent />
            </GalleryProvider>
          </MenuProvider>
        </WorkProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
