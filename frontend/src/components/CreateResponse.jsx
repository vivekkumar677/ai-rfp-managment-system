import { useState } from "react";
import { createRFPResponse } from "../api";

export default function SubmitResponse({ rfpId, vendorId }) {
  const [responseText, setResponseText] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    try {
      setStatus("Submitting...");
      await createRFPResponse(rfpId, vendorId, responseText);
      setStatus("Response submitted!");
      setResponseText("");
    } catch {
      setStatus("Failed to submit response");
    }
  };

  return (
    <div className="mt-4 border p-4 rounded">
      <h3 className="font-bold mb-2">Submit Vendor Response</h3>
      <textarea
        rows="4"
        className="w-full border p-2 mb-2"
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Submit Response
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
