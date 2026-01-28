import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// quick startup log to help debugging mounting issues
// eslint-disable-next-line no-console
console.log('Starting app...');

createRoot(document.getElementById("root")!).render(<App />);
