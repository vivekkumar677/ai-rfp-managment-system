import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRFPResponses, getRFPs, getVendors } from "../api";
import SendRFP from "../components/SendRFP";
import CreateResponse from "../components/CreateResponse";

export default function Vendors() {
  const { id } = useParams();
  const [rfp, setRfp] = useState(null);
  const [comparisons, setComparisons] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    getRFPs()
      .then((res) => {
        setRfp(res.data.find((r) => r._id === id));
      })
      .catch(console.error);

    getVendors()
      .then((res) => {
        setVendors(Array.isArray(res.data) ? res.data : res.data.vendors);
      })
      .catch(console.error);

    getRFPResponses(id)
      .then((res) => setComparisons(res.data))
      .catch(console.error);
  }, [id]);

  if (!rfp) return <p className="text-center mt-5">Loading...</p>;

  const vendorName = (vendorId) =>
    vendors.find((v) => v._id === vendorId)?.name || vendorId;

  return (
    <div className="container mt-4">

      {/* RFP Summary */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title text-primary fw-bold mb-3">{rfp.title}</h3>
          <p className="text-muted">{rfp.description}</p>

          <div className="row mt-3">
            <div className="col-md-4">
              <p><strong>Budget:</strong> ${rfp.budget}</p>
            </div>
            <div className="col-md-4">
              <p><strong>Delivery Days:</strong> {rfp.delivery_days}</p>
            </div>
            <div className="col-md-4">
              <p><strong>Payment Terms:</strong> {rfp.payment_terms}</p>
            </div>
          </div>

          <SendRFP rfpId={rfp._id} />
        </div>
      </div>

      {/* Vendor Comparison Section */}
      <h4 className="mt-4 mb-3">📊 Vendor Proposal Comparisons</h4>

      {comparisons.length === 0 ? (
        <p className="text-danger">No proposals submitted yet.</p>
      ) : (
        <div className="row">
          {comparisons.map((comp) => (
            <div className="col-md-4 mb-3" key={comp._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <span className="badge bg-info mb-2">
                    {vendorName(comp.vendorId)}
                  </span>

                  <h5 className="fw-bold">Score: {comp.score}/10</h5>
                  <p className="mt-2">{comp.summary}</p>

                  {comp.issues?.length > 0 && (
                    <div className="mt-3">
                      <strong>Issues:</strong>
                      <ul className="text-danger small">
                        {comp.issues.map((i, idx) => (
                          <li key={idx}>{i}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="mt-3">
                    <strong>Recommendation:</strong>{" "}
                    <span className="badge bg-warning text-dark">
                      {comp.recommendation}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Responses */}
      <h4 className="mt-5 mb-3">📨 Submit Proposal</h4>

      <div className="row">
        {vendors.map((vendor) => (
          <div className="col-md-4 mb-3" key={vendor._id}>
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="fw-bold mb-2">{vendor.name}</h5>
                <CreateResponse
                  rfpId={rfp._id}
                  vendorId={vendor._id}
                  vendorName={vendor.name}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
