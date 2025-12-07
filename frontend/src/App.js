import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RFPList from "./pages/RFPList";
import Vendors from "./pages/Vendors";
import ProposalList from "./pages/ProposalList";
import Navbar from "./pages/Navbar";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="p-6">
        {/* Navbar */}
        <Navbar />
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rfps" element={<RFPList />} />
          <Route path="/rfps/:id/vendors" element={<Vendors />} />
          {/* RFP Proposals page */}
          <Route path="/rfps/:rfpId/proposals" element={<ProposalList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
