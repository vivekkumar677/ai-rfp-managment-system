import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Vendor from './models/Vendor.js';
import RFP from './models/RFP.js';
import Proposal from './models/Proposal.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Vendor.deleteMany();
    await RFP.deleteMany();
    await Proposal.deleteMany();

    // --- Seed Vendors ---
    const vendorsData = [
      { name: "Vendor A", email: "a@example.com", phone: "1111111111", categories: ["IT", "Software"] },
      { name: "Vendor B", email: "b@example.com", phone: "2222222222", categories: ["Hardware"] },
      { name: "Vendor C", email: "c@example.com", phone: "3333333333", categories: ["Cloud", "AI"] },
      { name: "Vendor D", email: "d@example.com", phone: "4444444444", categories: ["Networking"] },
      { name: "Vendor E", email: "e@example.com", phone: "5555555555", categories: ["IT", "Hardware"] },
      { name: "Vendor F", email: "f@example.com", phone: "6666666666", categories: ["Software"] },
      { name: "Vendor G", email: "g@example.com", phone: "7777777777", categories: ["AI", "Cloud"] },
      { name: "Vendor H", email: "h@example.com", phone: "8888888888", categories: ["Furniture"] },
      { name: "Vendor I", email: "i@example.com", phone: "9999999999", categories: ["Office Supplies"] },
      { name: "Vendor J", email: "j@example.com", phone: "1010101010", categories: ["IT"] },
      { name: "Vendor K", email: "k@example.com", phone: "1111111112", categories: ["Hardware"] },
      { name: "Vendor L", email: "l@example.com", phone: "1212121212", categories: ["Cloud"] },
      { name: "Vendor M", email: "m@example.com", phone: "1313131313", categories: ["Software"] },
      { name: "Vendor N", email: "n@example.com", phone: "1414141414", categories: ["Networking"] },
      { name: "Vendor O", email: "o@example.com", phone: "1515151515", categories: ["AI"] },
      { name: "Vendor P", email: "p@example.com", phone: "1616161616", categories: ["Furniture"] },
      { name: "Vendor Q", email: "q@example.com", phone: "1717171717", categories: ["Office Supplies"] },
      { name: "Vendor R", email: "r@example.com", phone: "1818181818", categories: ["IT"] },
      { name: "Vendor S", email: "s@example.com", phone: "1919191919", categories: ["Software"] },
      { name: "Vendor T", email: "t@example.com", phone: "2020202020", categories: ["Cloud"] },
    ];

    const vendors = await Vendor.insertMany(vendorsData);
    console.log(`✅ Inserted ${vendors.length} vendors`);

    // --- Seed RFPs ---
    const rfpsData = [
      { title: "Buy 100 Laptops", description: "Need high-performance laptops for developers", dueDate: new Date(Date.now() + 7*24*60*60*1000) },
      { title: "Office Furniture", description: "Furniture for 50 employees", dueDate: new Date(Date.now() + 14*24*60*60*1000) },
      { title: "Cloud Services Subscription", description: "Cloud platform subscription for 12 months", dueDate: new Date(Date.now() + 21*24*60*60*1000) },
      { title: "Networking Equipment", description: "Routers, switches, firewalls", dueDate: new Date(Date.now() + 10*24*60*60*1000) },
      { title: "Software Licenses", description: "Purchase of productivity software licenses", dueDate: new Date(Date.now() + 12*24*60*60*1000) },
      { title: "AI Services", description: "AI model deployment and training services", dueDate: new Date(Date.now() + 18*24*60*60*1000) },
      { title: "Printers and Scanners", description: "Office printing and scanning devices", dueDate: new Date(Date.now() + 15*24*60*60*1000) },
      { title: "Security Cameras", description: "Install security surveillance in office", dueDate: new Date(Date.now() + 20*24*60*60*1000) },
      { title: "Cafeteria Supplies", description: "Purchase coffee machines and cafeteria items", dueDate: new Date(Date.now() + 22*24*60*60*1000) },
      { title: "Website Hosting & Domain", description: "Domain registration and hosting for company website", dueDate: new Date(Date.now() + 25*24*60*60*1000) },
    ];

    const rfps = await RFP.insertMany(rfpsData);
    console.log(`✅ Inserted ${rfps.length} RFPs`);

    // --- Seed dummy proposals ---
    const proposals = [];
    rfps.forEach(rfp => {
      const numProposals = Math.floor(Math.random() * 3) + 1; // 1-3 proposals per RFP
      for (let i = 0; i < numProposals; i++) {
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        proposals.push({
          rfpId: rfp._id,
          vendorId: vendor._id,
          amount: Math.floor(Math.random() * 1000) + 500, // ✅ Add amount
          responseText: `Proposal from ${vendor.name} for "${rfp.title}". Delivery: ${Math.floor(Math.random()*10)+1} days.`,
          score: Math.floor(Math.random() * 10) + 1,
          summary: "AI-assisted evaluation placeholder",
          issues: ["Missing warranty info", "No service details"],
          recommendation: ["Accept", "Negotiate", "Reject"][Math.floor(Math.random() * 3)]
        });
      }
    });

    await Proposal.insertMany(proposals);
    console.log(`✅ Inserted ${proposals.length} dummy proposals`);

    console.log("🎉 Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seed();
