import axios from "axios";

const API_URL = "http://localhost:4000/api"; // adjust to your backend

// ===== RFP APIs =====
export const createRFP = (rfpData) =>
  axios.post(`${API_URL}/rfps`, rfpData);

export const getRFPs = () => axios.get(`${API_URL}/rfps`);

export const sendRFPToVendors = (rfpId, vendorIds) =>
  axios.post(`${API_URL}/rfps/${rfpId}/send`, { vendorIds });

// ===== Proposal APIs =====
export const createProposal = (proposalData) =>
  axios.post(`${API_URL}/proposals`, proposalData);

export const getProposals = () => axios.get(`${API_URL}/proposals`);

// ===== Vendor APIs =====
export const getVendors = () => axios.get(`${API_URL}/vendors`);

// ===== RFP Response APIs (if needed) =====
export const createRFPResponse = (rfpId, vendorId, responseText) =>
  axios.post(`${API_URL}/responses`, { rfpId, vendorId, responseText });

export const getRFPResponses = (rfpId) =>
  axios.get(`${API_URL}/responses/compare/${rfpId}`);
