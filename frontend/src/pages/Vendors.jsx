import { useEffect, useState } from "react";
import { getVendors } from "../api";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    getVendors()
      .then(res => {
        console.log("Vendors API Response:", res.data);
        setVendors(res.data); // handles both {vendors:[]} or [] response
      })
      .catch(err => console.error("Vendor Load Error:", err));
  }, []);

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
                  <p className="card-text"><strong>Email:</strong> {v.email}</p>
                  <p className="card-text"><strong>Phone:</strong> {v.phone}</p>
                  <p className="card-text">
                    <strong>Categories:</strong>{" "}
                    {v.categories && v.categories.length > 0 ? v.categories.join(", ") : "N/A"}
                  </p>
                </div>
                <div className="card-footer text-center">
                  <button className="btn btn-sm btn-outline-primary">Send RFP</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
