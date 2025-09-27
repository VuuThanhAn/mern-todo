import { Router } from "express";
import * as ctl from "../controllers/todo.controller.js";

const r = Router();

// Lấy danh sách todo + filter + pagination
// /api/todos?page=&limit=&status=&from=&to=
r.get("/", ctl.list);

// Thống kê nhanh
r.get("/stats", ctl.stats);

// Thêm mới todo
r.post("/", ctl.create);

// Cập nhật todo
r.put("/:id", ctl.update);

// Xóa todo
r.delete("/:id", ctl.remove);

export default r;
