import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "antd/dist/reset.css";

import App from "@/app/index";
import "@/app/app.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
