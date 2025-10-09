import { BrowserRouter, useLocation } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { WorkProvider } from "./context/WorkContext";
import { MenuProvider } from "./context/MenuContext";
import { GalleryProvider } from "./context/GalleryContext";

import AppWrapper from "./AppWrapper";
import Header from "./components/Header";

function AppContent() {
  const location = useLocation();

  // Hide header on login and dashboard
  const noHeaderRoutes = ["/login", "/dashboard"];
  const hideHeader = noHeaderRoutes.some((route) =>
    location.pathname.includes(route)
  );

  return (
    <>
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
