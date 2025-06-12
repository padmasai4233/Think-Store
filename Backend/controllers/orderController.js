

// Place Order : /api/order/cod

import Order from "../models/Order.js";
import Product from "../models/product.js";

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" });
        }

        let amount = 0;

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.json({ success: false, message: "Product not found" });
            }
            amount += product.offerprice * item.quantity;
        }

        amount += Math.floor(amount * 0.02); // Add tax

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        res.json({ success: true, message: "Order placed successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// Get Orders by User Id : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.query;


        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })
        .populate('items.product')
        .populate('address')
        .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error("❌ Error fetching user orders:", error.message);
        res.json({ success: false, message: error.message });
    }
};





// Get All orders (for seller / admin) : /api/order/seller

export const getAllOrders = async (req, res) =>{
    try {
        const orders = await Order.find({$or: [{paymentType: "COD"}, {isPaid: true}]}).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message});
    }
}