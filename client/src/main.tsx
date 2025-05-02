import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

// Add Google and Facebook SDK for OAuth login
const loadScript = (id: string, src: string) => {
  if (document.getElementById(id)) return;
  
  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

// Load Google API script
loadScript(
  "google-api",
  "https://accounts.google.com/gsi/client"
);

// Load Facebook SDK
loadScript(
  "facebook-sdk",
  "https://connect.facebook.net/en_US/sdk.js"
);

// Initialize Facebook SDK
window.fbAsyncInit = function() {
  FB.init({
    appId: import.meta.env.VITE_FACEBOOK_APP_ID || '123456789',
    cookie: true,
    xfbml: true,
    version: 'v18.0'
  });
};

createRoot(root).render(<App />);
