import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProposals } from "../api";

export default function ProposalList() {
  const { rfpId } = useParams();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!rfpId) return;
    setLoading(true);
    setError("");

    getProposals()
      .then((res) => {
        // Filter proposals for this RFP
        const filtered = res.data.filter((p) => p.rfp._id === rfpId);
        setProposals(filtered);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load proposals.");
      })
      .finally(() => setLoading(false));
  }, [rfpId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (proposals.length === 0)
    return <p className="text-center text-muted mt-5">No proposals submitted for this RFP yet.</p>;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Proposals for RFP</h1>
      <div className="row">
        {proposals.map((proposal) => (
          <div className="col-md-6 mb-4" key={proposal._id}>
            <div className="card shadow-sm h-100">
              <div className="card-header bg-success text-white fw-bold">{proposal.vendor.name}</div>
              <div className="card-body d-flex flex-column">
                <p><strong>Amount:</strong> ${proposal.amount}</p>
                <p><strong>Analysis Score:</strong> {proposal.analysis?.score || "N/A"}</p>
                <p><strong>Summary:</strong> {proposal.analysis?.summary || "N/A"}</p>
                <p><strong>Recommendation:</strong> {proposal.analysis?.recommendation || "N/A"}</p>
                <p><strong>Issues:</strong> {proposal.analysis?.issues?.join(", ") || "None"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
