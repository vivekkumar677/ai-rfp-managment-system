import Vendor from '../models/Vendor.js';

// Create Vendor
export const createVendor = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email)
      return res.status(400).json({ message: "Name and Email are required" });

    const vendor = new Vendor(req.body);
    await vendor.save();

    res.status(201).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Vendors
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors); // FIXED
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
