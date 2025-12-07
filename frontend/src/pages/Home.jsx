import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api";

const Home = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [rfps, setRfps] = useState([]);
  const [error, setError] = useState("");

  const fetchRFPs = async () => {
    try {
      const res = await axios.get(`${API_URL}/rfps`);
      // Ensure rfps is always an array
      setRfps(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error("Fetch RFPs Error:", err);
      setError("Failed to fetch RFPs");
    }
  };

  useEffect(() => {
    fetchRFPs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/rfps`, { text });
      const newRFP = res.data;
      // Always merge as array
      setRfps((prev) => [newRFP, ...prev]);
      setText("");
    } catch (err) {
      console.error("Generate RFP Error:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to generate RFP. Please try again.";
      setError(msg);
    }

    setLoading(false);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h2 className="text-center mb-4 fw-bold text-primary">
            AI-Powered RFP Generator
          </h2>

          <div className="card shadow-lg mb-4">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Describe what you want to purchase..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : null}
                  {loading ? "Generating..." : "Generate RFP"}
                </button>
              </form>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
          </div>

          {/* RFP List */}
          {rfps.length > 0 &&
            rfps.map((rfp) => (
              <div className="card shadow-lg mb-3" key={rfp._id}>
                <div className="card-header bg-primary text-white fw-bold">
                  {rfp.title}
                </div>
                <div className="card-body">
                  <p>{rfp.description}</p>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <strong>Budget:</strong> ${rfp.budget}
                    </div>
                    <div className="col-md-4">
                      <strong>Delivery:</strong> {rfp.delivery_days} days
                    </div>
                    <div className="col-md-4">
                      <strong>Payment:</strong> {rfp.payment_terms}
                    </div>
                  </div>

                  <h5>Items:</h5>
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Specs</th>
                        <th>Quantity</th>
                        <th>Warranty (years)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfp.items?.map((item, i) => (
                        <tr key={i}>
                          <td>{item.name}</td>
                          <td>{item.specs}</td>
                          <td>{item.quantity}</td>
                          <td>{item.warranty_years}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
