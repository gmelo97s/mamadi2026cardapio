import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/shrikhand/latin-400.css";
import "@fontsource/kalam/latin-400.css";
import "@fontsource/kalam/latin-700.css";
import "@fontsource/lilita-one/latin-400.css";
import "@fontsource/yellowtail/latin-400.css";
import "@fontsource-variable/archivo/wdth.css";
import "./styles/global.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
