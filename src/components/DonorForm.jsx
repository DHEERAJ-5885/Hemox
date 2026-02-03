import { useState } from "react";

function DonorForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    location: ""
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    console.log("Donor Registered:", formData);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Donor Registration</h2>

      {submitted ? (
        <p>✅ Registration successful!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            required
          />

          <select
            name="bloodGroup"
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>

          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>
      )}
    </div>
  );
}

export default DonorForm;
