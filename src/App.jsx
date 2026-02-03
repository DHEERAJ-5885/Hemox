import { useRef } from "react";
import Register from "./pages/Register";
import DonorList from "./pages/DonorList";
import "./App.css";

export default function App() {
  const refreshRef = useRef(null);

  return (
    <div className="page">
      <h1 className="app-title">HEMOX</h1>

      <div className="card">
        <Register onSuccess={() => refreshRef.current && refreshRef.current()} />
      </div>

      <div className="card">
        <DonorList refreshRef={refreshRef} />
      </div>
    </div>
  );
}
