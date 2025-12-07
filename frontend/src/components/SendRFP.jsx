import React, { useEffect, useState } from "react";
import { getVendors, sendRFPToVendors } from "../api";

export default function SendRFP({ rfpId }) {
  const [vendors, setVendors] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getVendors()
      .then((res) => setVendors(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Failed to load vendors:", err));
  }, []);

  const toggleVendor = (vendorId) => {
    setSelected((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSend = async () => {
    if (selected.length === 0) {
      setMessage({ type: "danger", text: "Please select at least one vendor." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await sendRFPToVendors(rfpId, selected);
      setMessage({ type: "success", text: "RFP sent successfully!" });
      setSelected([]);
    } catch (err) {
      console.error(err);
      setMessage({ type: "danger", text: "Failed to send RFP. Try again." });
    }

    setLoading(false);
  };

  return (
    <div className="card mt-4">
      <div className="card-header bg-primary text-white">
        Send RFP to Vendors
      </div>
      <div className="card-body">
        {message && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <div className="mb-3">
          {vendors.length === 0 ? (
            <p>No vendors available.</p>
          ) : (
            <div className="form-check">
              {vendors.map((vendor) => (
                <div className="form-check" key={vendor._id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={vendor._id}
                    id={`vendor-${vendor._id}`}
                    checked={selected.includes(vendor._id)}
                    onChange={() => toggleVendor(vendor._id)}
                  />
                  <label className="form-check-label" htmlFor={`vendor-${vendor._id}`}>
                    {vendor.name} ({vendor.email})
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="btn btn-success"
          disabled={loading || vendors.length === 0}
          onClick={handleSend}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm me-2"></span>
          ) : null}
          Send RFP
        </button>
      </div>
    </div>
  );
}
