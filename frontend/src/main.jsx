import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

import { UserProvider } from "./context/UserProvider.jsx";
import { MusicProvider } from "./context/MusicProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <MusicProvider>
        <App />
      </MusicProvider>
    </UserProvider>
  </BrowserRouter>
);
