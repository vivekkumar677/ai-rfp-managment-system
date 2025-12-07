import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Vendor from '../models/Vendor.js';
import RFP from '../models/RFP.js';

dotenv.config();

const seed = async () => {
    try {
        await connectDB();
        console.log("Connected to database");

        // Clear existing data
        await Vendor.deleteMany();
        await RFP.deleteMany();

        // Seed Vendors
        const vendors = await Vendor.insertMany([
            { name: "Vendor A", email: "a@example.com", phone: "1234567890" },
            { name: "Vendor B", email: "b@example.com", phone: "1234567891" },
            { name: "Vendor C", email: "c@example.com", phone: "1234567892" },
        ]);

        // Seed RFPs
        const rfps = await RFP.insertMany([
            { title: "RFP 1", description: "Buy 100 Laptop", dueDate: new Date(Date.now() + 7*24*60*60*1000) },
            { title: "RFP 2", description: "Office Furniture for 50 employees", dueDate: new Date(Date.now() + 14*24*60*60*1000) },
            { title: "RFP 3", description: "Cloud Services Subscription", dueDate: new Date(Date.now() + 21*24*60*60*1000) },
        ]);

        console.log("Database seeded successfully");
        process.exit();

    } catch (error) {
        console.error("Error seeding database:", error.message);
        process.exit(1);
    }
};
seed();