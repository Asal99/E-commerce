import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByEmail,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/email/:email", getOrdersByEmail);
router.get("/:id", getOrderById);

router.put("/:id/status", updateOrderStatus);
router.put("/:id/cancel", cancelOrder);

export default router;
