import { useEffect, useState } from "react";
import { getAllDonors } from "../services/donorService";
import RequestBlood from "./RequestBlood";

export default function DonorList({ refreshRef }) {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDonors();
  }, []);

  // ✅ expose refresh function to App
  useEffect(() => {
    if (refreshRef) refreshRef.current = fetchDonors;
  }, [refreshRef]);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const list = await getAllDonors();
      setDonors(list);
    } catch (err) {
      console.error("Error fetching donors:", err);
    } finally {
      setLoading(false);
    }
  };

  const cleanPhone = (phone) => String(phone || "").replace(/\D/g, "");

  const callLink = (phone) => {
    const p = cleanPhone(phone);
    return `tel:${p}`;
  };

  const whatsappLink = (phone, donorName, bloodGroup) => {
    let p = String(phone || "").trim();
    p = p.replace(/[^\d]/g, "");

    // India default
    if (p.length === 10) p = "91" + p;
    if (p.length === 11 && p.startsWith("0")) p = "91" + p.slice(1);

    const msg = encodeURIComponent(
      `Hi ${donorName}, I need blood (${bloodGroup}). Can you help?`
    );

    return `https://api.whatsapp.com/send?phone=${p}&text=${msg}`;
  };

  const filteredDonors = donors.filter((d) => {
    const bg = (d.bloodGroup || "").toLowerCase();
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return bg.includes(q);
  });

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Registered Donors</h2>

      <input
        placeholder="Search blood group (Eg: O+, A-, B+)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          margin: "10px 0 20px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      <button
        onClick={fetchDonors}
        style={{
          padding: "10px 16px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          marginBottom: "18px",
          background: "#111",
          color: "white",
        }}
      >
        {loading ? "Refreshing..." : "Refresh Donors"}
      </button>

      {filteredDonors.length === 0 ? (
        <p>No donors found</p>
      ) : (
        filteredDonors.map((donor) => (
          <div
            key={donor.id}
            style={{
              border: "1px solid #ddd",
              padding: "18px",
              borderRadius: "6px",
              marginBottom: "15px",
              background: "white",
            }}
          >
            <p>
              <strong>Name:</strong> {donor.name}
            </p>
            <p>
              <strong>Blood Group:</strong> {donor.bloodGroup}
            </p>
            <p>
              <strong>Phone:</strong> {donor.phone}
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <a
                href={callLink(donor.phone)}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px",
                  background: "#0b5cff",
                  color: "white",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                📞 Call
              </a>

              <a
                href={whatsappLink(donor.phone, donor.name, donor.bloodGroup)}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "10px",
                  background: "#22c55e",
                  color: "white",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        ))
      )}

      <RequestBlood
        donors={donors}
        cleanPhone={cleanPhone}
        whatsappLink={whatsappLink}
      />
    </div>
  );
}
