import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

console.log("Umami ID:", import.meta.env.VITE_UMAMI_WEBSITE_ID);
if (import.meta.env.VITE_UMAMI_WEBSITE_ID) {
  const script = document.createElement("script");
  script.defer = true;
  script.src = import.meta.env.VITE_UMAMI_SRC;
  script.setAttribute("data-website-id", import.meta.env.VITE_UMAMI_WEBSITE_ID);
  document.head.appendChild(script);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
