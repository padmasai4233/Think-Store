import User from "../models/User.js";

export const updateCart = async (req, res) => {
  try {
    const { cardItems } = req.body; // 🛑 this is the correct key in req.body

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    // ✅ Save into `cartItems` field in schema
    await User.findByIdAndUpdate(req.userId, { cartItems: cardItems });

    res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.log("Update cart error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
