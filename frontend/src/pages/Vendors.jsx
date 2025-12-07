import { useEffect, useState } from "react";
import { getVendors, sendRFPToVendors } from "../api";

export default function Vendors({ rfpId }) { // Pass RFP ID as prop
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getVendors()
      .then(res => setVendors(res.data))
      .catch(err => console.error("Vendor Load Error:", err));
  }, []);

  const handleSendRFP = async (vendorId) => {
    if (!rfpId) return alert("No RFP selected");

    setLoading(true);
    try {
      await sendRFPToVendors(rfpId, [vendorId]);
      alert("RFP sent successfully!");
    } catch (err) {
      console.error("Send RFP Error:", err);
      alert("Failed to send RFP. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-3xl mb-4 text-center text-primary">Vendors List</h1>
      {vendors.length === 0 ? (
        <p className="text-center text-danger">No vendors found.</p>
      ) : (
        <div className="row">
          {vendors.map((v) => (
            <div className="col-md-4 mb-4" key={v._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{v.name}</h5>
                  <p><strong>Email:</strong> {v.email}</p>
                  <p><strong>Phone:</strong> {v.phone}</p>
                  <p>
                    <strong>Categories:</strong>{" "}
                    {v.categories?.length ? v.categories.join(", ") : "N/A"}
                  </p>
                </div>
                <div className="card-footer text-center">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleSendRFP(v._id)}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send RFP"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
