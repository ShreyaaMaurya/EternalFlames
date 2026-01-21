const Order = require("../models/order");

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      pincode,
      items,
      totalAmount
    } = req.body;

    const userId = req.user.id; // Now required since auth is enforced

    const newOrder = new Order({
      userId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      pincode,
      items,
      totalAmount,
      status: "Pending"
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });

  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get orders by userId
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single order by ID (User - only own orders)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found or not authorized" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update status
const updateOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });

    res.json({
      message: "Order status updated",
      order: updatedOrder,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel order
const cancelOrderByUser = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });

    if (!order)
      return res.status(404).json({ message: "Order not found or not authorized" });

    if (order.status !== "Pending")
      return res.status(400).json({ message: "Only pending orders can be cancelled" });

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  getOrderById,
  getOrdersByUserId,
  cancelOrderByUser,
  deleteOrder
};
