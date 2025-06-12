import Address from "../models/Address.js";



// Add Address : /api/address/add
export const addAddress = async (req, res) =>{
    // console.log("Incoming address data:", req.body);
    try {
        // const {address, userId} = req.body;
        await Address.create(req.body);
        res.json({success: true, message: "Address Added Successfully"});
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}

// Get Address : /api/address/get

export const getAddress = async (req, res) => {
    try {
        const userId = req.query.userId || req.body.userId;
        const addresses = await Address.find({ userId }); // ✅ always returns array
        res.json({ success: true, addresses });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

