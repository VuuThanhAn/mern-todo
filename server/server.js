import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import todoRoutes from "./src/routes/todo.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan("dev"));

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err.message));

// Route kiểm tra API
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// Routes Todo
app.use("/api/todos", todoRoutes);

// Lắng nghe server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});
