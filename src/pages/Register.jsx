import { useState } from "react";
import { addDonor, donorExistsByPhone } from "../services/donorService";

export default function Register({ onSuccess }) {
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !bloodGroup || !phone) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const exists = await donorExistsByPhone(phone);

      if (exists) {
        alert("Donor with this phone already exists");
        setLoading(false);
        return;
      }

      await addDonor({ name, bloodGroup, phone });

      alert("Donor registered successfully");

      setName("");
      setBloodGroup("");
      setPhone("");

      // refresh donor list
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Register error:", err);
      alert("Something went wrong. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register Donor</h2>

      <input
        className="input"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <select
        className="select"
        value={bloodGroup}
        onChange={(e) => setBloodGroup(e.target.value)}
      >
        <option value="">Select Blood Group</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
      </select>

      <br /><br />

      <input
        className="input"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <br /><br />

      <button
        className="btn"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}
