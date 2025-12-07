import { useEffect, useState } from "react";
import { getRFPs } from "../api";
import { Link } from "react-router-dom";

export default function RFPList() {
  const [rfps, setRfps] = useState([]);

  useEffect(() => {
    getRFPs()
      .then((res) => {
        console.log("RFPs API Response:", res.data);
        setRfps(res.data.rfps || res.data); // handles {rfps:[]} or []
      })
      .catch((err) => console.error("RFP Load Error:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-3xl mb-4 text-center text-primary">All RFPs</h1>

      {rfps.length === 0 ? (
        <p className="text-center text-danger">No RFPs found.</p>
      ) : (
        <div className="row">
          {rfps.map((rfp) => (
            <div className="col-md-4 mb-4" key={rfp._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-primary">{rfp.title}</h5>
                  <p className="card-text text-muted">{rfp.description}</p>
                  <p className="card-text">
                    <strong>Budget:</strong> ${rfp.budget || "N/A"}
                  </p>
                  <p className="card-text">
                    <strong>Delivery Days:</strong> {rfp.delivery_days || "N/A"}
                  </p>
                  <p className="card-text">
                    <strong>Payment Terms:</strong> {rfp.payment_terms || "N/A"}
                  </p>
                  {rfp.dueDate && (
                    <p className="card-text">
                      <strong>Due Date:</strong> {new Date(rfp.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="card-footer text-center">
                  <Link to={`/rfps/${rfp._id}/proposals`} className="btn btn-sm btn-primary">
                    View Proposals
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
