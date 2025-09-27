import Todo from "../models/todo.model.js";

/**
 * GET /api/todos
 * Query: ?status=true/false&from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&limit=10
 */
export const list = async (req, res) => {
  try {
    const { status, from, to, page = 1, limit = 10 } = req.query;

    // Xây dựng điều kiện filter
    const q = {};
    if (status === "true") q.completed = true;
    if (status === "false") q.completed = false;

    if (from || to) {
      q.createdAt = {};
      if (from) q.createdAt.$gte = new Date(from);
      if (to) q.createdAt.$lte = new Date(to);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Todo.find(q)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Todo.countDocuments(q),
    ]);

    res.json({
      items,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/todos
 * Body: { title, dueAt }
 */
export const create = async (req, res) => {
  try {
    const { title, dueAt } = req.body;
    const todo = await Todo.create({ title, dueAt });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/todos/:id
 * Body: { title?, completed?, dueAt? }
 */
export const update = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /api/todos/:id
 */
export const remove = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/todos/stats
 * Thống kê nhanh: theo trạng thái + theo ngày
 */
export const stats = async (req, res) => {
  try {
    const [byStatus, byDay] = await Promise.all([
      // Nhóm theo completed
      Todo.aggregate([
        { $group: { _id: "$completed", count: { $sum: 1 } } },
      ]),

      // Nhóm theo ngày tạo
      Todo.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({ byStatus, byDay });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
