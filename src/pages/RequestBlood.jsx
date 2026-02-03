import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function RequestBlood({ donors, cleanPhone, whatsappLink }) {
  const [neededGroup, setNeededGroup] = useState("");
  const [area, setArea] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const [saving, setSaving] = useState(false);
  const [recentRequests, setRecentRequests] = useState([]);

  // ✅ Load recent requests from Firestore
  useEffect(() => {
    fetchRecentRequests();
  }, []);

  const fetchRecentRequests = async () => {
    try {
      const q = query(
        collection(db, "requests"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRecentRequests(list);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleFind = async () => {
    setSearched(true);

    const bg = neededGroup.trim().toLowerCase();

    // ✅ find matching donors (same logic)
    const filtered = donors.filter(
      (d) => (d.bloodGroup || "").toLowerCase() === bg
    );
    setResults(filtered);

    // ✅ Save request to Firestore
    setSaving(true);
    try {
      await addDoc(collection(db, "requests"), {
        neededGroup: neededGroup,
        area: area || "",
        matchedCount: filtered.length,
        createdAt: serverTimestamp(),
      });

      // refresh recent requests list
      await fetchRecentRequests();
    } catch (err) {
      console.error("Error saving request:", err);
      alert("Request not saved. Check Firestore rules / console.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Request Blood</h2>

      {/* ✅ Request Form */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "18px",
          borderRadius: "8px",
          background: "white",
        }}
      >
        <label>
          <strong>Needed Blood Group</strong>
        </label>
        <br />
        <select
          value={neededGroup}
          onChange={(e) => setNeededGroup(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
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

        <br />
        <br />

        <label>
          <strong>Area / City (Optional)</strong>
        </label>
        <br />
        <input
          placeholder="Eg: Hyderabad, Vizag..."
          value={area}
          onChange={(e) => setArea(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <br />
        <br />

        <button
          onClick={handleFind}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            background: "#b30000",
            color: "white",
            fontWeight: "bold",
          }}
          disabled={!neededGroup || saving}
        >
          {saving ? "Saving Request..." : "Find Donors"}
        </button>
      </div>

      {/* ✅ Matching Donors */}
      <div style={{ marginTop: "20px" }}>
        {searched && (
          <>
            <h3>Matching Donors</h3>

            {results.length === 0 ? (
              <p>No donors found for {neededGroup}</p>
            ) : (
              results.map((d) => (
                <div
                  key={d.id}
                  style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    borderRadius: "6px",
                    marginBottom: "12px",
                    background: "white",
                  }}
                >
                  <p>
                    <strong>Name:</strong> {d.name}
                  </p>
                  <p>
                    <strong>Blood Group:</strong> {d.bloodGroup}
                  </p>
                  <p>
                    <strong>Phone:</strong> {d.phone}
                  </p>

                  {area && (
                    <p style={{ fontStyle: "italic" }}>
                      Requested Area: {area}
                    </p>
                  )}

                  <div style={{ marginTop: "10px" }}>
                    <a
                      href={whatsappLink(d.phone, d.name, d.bloodGroup)}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-block",
                        width: "100%",
                        textAlign: "center",
                        padding: "10px",
                        background: "#22c55e",
                        color: "white",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontWeight: "bold",
                      }}
                    >
                      💬 Message on WhatsApp
                    </a>

                    <p style={{ fontSize: "12px", marginTop: "6px", opacity: 0.7 }}>
                      WhatsApp number used: {cleanPhone(d.phone)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* ✅ Recent Requests */}
      <div style={{ marginTop: "30px" }}>
        <h2>Recent Requests</h2>

        {recentRequests.length === 0 ? (
          <p>No requests yet</p>
        ) : (
          recentRequests.map((r) => (
            <div
              key={r.id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "12px",
                background: "white",
              }}
            >
              <p>
                <strong>Needed:</strong> {r.neededGroup}
              </p>
              <p>
                <strong>Area:</strong> {r.area || "Not provided"}
              </p>
              <p>
                <strong>Matched Donors:</strong> {r.matchedCount ?? 0}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
