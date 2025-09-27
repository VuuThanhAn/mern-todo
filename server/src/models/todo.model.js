import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    dueAt: {
      type: Date, // tùy chọn deadline
    },
  },
  { timestamps: true } // tự động có createdAt, updatedAt
);

// Tạo index để phục vụ filter theo thời gian
TodoSchema.index({ createdAt: 1 });

export default mongoose.model("Todo", TodoSchema);
