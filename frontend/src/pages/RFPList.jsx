import { useEffect, useState } from "react";
import { getRFPs } from "../api";
import { Link } from "react-router-dom";

export default function RFPList() {
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRFPs()
      .then(res => setRfps(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load RFPs.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading RFPs...</p>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container">
      <h1 className="mb-4 text-primary">All RFPs</h1>
      <div className="row">
        {rfps.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info">No RFPs available.</div>
          </div>
        )}
        {rfps.map((rfp) => (
          <div className="col-md-6 mb-4" key={rfp._id}>
            <div className="card shadow-sm h-100">
              <div className="card-header bg-primary text-white fw-bold">
                {rfp.title}
              </div>
              <div className="card-body">
                <p>{rfp.description}</p>
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item"><strong>Budget:</strong> ${rfp.budget}</li>
                  <li className="list-group-item"><strong>Delivery Days:</strong> {rfp.delivery_days}</li>
                  <li className="list-group-item"><strong>Payment Terms:</strong> {rfp.payment_terms}</li>
                </ul>
                <Link
                  to={`/rfps/${rfp._id}/proposals`}
                  className="btn btn-outline-primary w-100"
                >
                  View Proposals
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
