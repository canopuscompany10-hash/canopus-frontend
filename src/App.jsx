import { BrowserRouter, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { UserProvider } from "./context/UserContext";
import { WorkProvider } from "./context/WorkContext";
import { MenuProvider } from "./context/MenuContext";
import { GalleryProvider } from "./context/GalleryContext";

import AppWrapper from "./AppWrapper";
import Header from "./components/Header";

// 🧠 SEO Handler Component (Dynamic Title + Description)
function SEOHandler() {
  const location = useLocation();

  useEffect(() => {
    let title = "Catering Canopus | Smart Catering Management";
    let description =
      "Manage catering projects, menus, and staff effortlessly with Catering Canopus.";

    // Customize titles/descriptions per route
    if (location.pathname === "/") {
      title = "Home | Catering Canopus";
      description =
        "Welcome to Catering Canopus — manage your catering services with ease.";
    } else if (location.pathname.includes("/offerings")) {
      title = "Offerings | Catering Canopus";
      description =
        "Explore our diverse catering offerings and packages for every occasion.";
    } else if (location.pathname.includes("/dashboard")) {
      title = "Dashboard | Catering Canopus";
      description =
        "View your catering projects, works, and performance insights.";
    } else if (location.pathname.includes("/login")) {
      title = "Login | Catering Canopus";
      description =
        "Login to your Catering Canopus account to manage your operations.";
    }

    document.title = title;

    // Update or create meta description dynamically
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

  // Hide header on login and dashboard
  const noHeaderRoutes = ["/login", "/dashboard"];
  const hideHeader = noHeaderRoutes.some((route) =>
    location.pathname.includes(route)
  );

  return (
    <>
      {/* ✅ SEO Handler */}
      <SEOHandler />

      {/* ✅ Conditional Header */}
      {!hideHeader && <Header />}

      {/* ✅ Main App Routes */}
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
