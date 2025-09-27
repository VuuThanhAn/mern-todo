// import { useEffect, useState } from "react";
// import api from "../services/api";

// export default function Home() {
//   // Query params (phân trang + lọc)
//   const [q, setQ] = useState({
//     page: 1,
//     limit: 6,
//     status: "",
//     from: "",
//     to: "",
//   });

//   // Data từ backend
//   const [data, setData] = useState({
//     items: [],
//     total: 0,
//     page: 1,
//     pages: 1,
//   });

//   // Input thêm todo mới
//   const [title, setTitle] = useState("");

//   // Load todos từ API
//   const load = async () => {
//     const res = await api.get("/todos", { params: q });
//     setData(res.data);
//   };

//   useEffect(() => {
//     load();
//   }, [q]);

//   // Thêm task
//   const add = async (e) => {
//     e.preventDefault();
//     if (!title.trim()) return;
//     await api.post("/todos", { title });
//     setTitle("");
//     load();
//   };

//   // Toggle completed
//   const toggle = async (id, completed) => {
//     await api.put(`/todos/${id}`, { completed });
//     load();
//   };

//   // Xóa task
//   const remove = async (id) => {
//     await api.delete(`/todos/${id}`);
//     load();
//   };

//   return (
//     <div className="mx-auto max-w-2xl p-6 space-y-6">
//       {/* Form thêm task */}
//       <form onSubmit={add} className="flex gap-2">
//         <input
//           className="flex-1 px-3 py-2 border rounded-lg"
//           placeholder="New task..."
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//         >
//           Add
//         </button>
//       </form>

//       {/* Bộ lọc */}
//       <div className="flex flex-wrap gap-2 items-end">
//         <select
//           className="border rounded px-2 py-1"
//           value={q.status}
//           onChange={(e) => setQ((s) => ({ ...s, status: e.target.value, page: 1 }))}
//         >
//           <option value="">All</option>
//           <option value="true">Completed</option>
//           <option value="false">Not completed</option>
//         </select>

//         <input
//           type="date"
//           className="border rounded px-2 py-1"
//           onChange={(e) => setQ((s) => ({ ...s, from: e.target.value, page: 1 }))}
//         />
//         <input
//           type="date"
//           className="border rounded px-2 py-1"
//           onChange={(e) => setQ((s) => ({ ...s, to: e.target.value, page: 1 }))}
//         />
//       </div>

//       {/* Danh sách todos */}
//       <ul className="space-y-2">
//         {data.items.map((t) => (
//           <li
//             key={t._id}
//             className="p-3 border rounded flex justify-between items-center"
//           >
//             <div className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={t.completed}
//                 onChange={() => toggle(t._id, !t.completed)}
//               />
//               <span className={t.completed ? "line-through opacity-60" : ""}>
//                 {t.title}
//               </span>
//             </div>
//             <button
//               onClick={() => remove(t._id)}
//               className="text-red-600 hover:underline"
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>

//       {/* Phân trang */}
//       <div className="flex items-center gap-2">
//         <button
//           disabled={data.page <= 1}
//           onClick={() => setQ((s) => ({ ...s, page: s.page - 1 }))}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         <span>
//           Page {data.page} / {data.pages}
//         </span>
//         <button
//           disabled={data.page >= data.pages}
//           onClick={() => setQ((s) => ({ ...s, page: s.page + 1 }))}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ListTodo,
  Filter,
  Calendar,
} from "lucide-react";
import api from "../services/api";

export default function Home() {
  const [q, setQ] = useState({ page: 1, limit: 5, status: "", from: "", to: "" });
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [stats, setStats] = useState({ byStatus: [], byDay: [] });
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  // Load todos
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/todos", { params: q });
      setData(res.data);
    } catch (err) {
      console.error("❌ Load todos error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load stats
  const loadStats = async () => {
    try {
      const res = await api.get("/todos/stats");
      setStats(res.data);
    } catch (err) {
      console.error("❌ Load stats error:", err);
    }
  };

  useEffect(() => {
    load();
  }, [q]);

  useEffect(() => {
    loadStats();
  }, []);

  // Add / Update
  const addOrUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title cannot be empty");

    try {
      if (editId) {
        await api.put(`/todos/${editId}`, { title });
        setData((prev) => ({
          ...prev,
          items: prev.items.map((t) =>
            t._id === editId ? { ...t, title } : t
          ),
        }));
        setEditId(null);
      } else {
        const res = await api.post("/todos", { title });
        setData((prev) => ({
          ...prev,
          items: [res.data, ...prev.items],
        }));
      }
      setTitle("");
      loadStats();
    } catch (err) {
      console.error("❌ Save todo error:", err);
    }
  };

  // Toggle completed
  const toggle = async (id, completed) => {
    try {
      await api.put(`/todos/${id}`, { completed: !completed });
      setData((prev) => ({
        ...prev,
        items: prev.items.map((t) =>
          t._id === id ? { ...t, completed: !completed } : t
        ),
      }));
      loadStats();
    } catch (err) {
      console.error("❌ Toggle error:", err);
    }
  };

  // Delete
  const remove = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/todos/${id}`);
      setData((prev) => ({
        ...prev,
        items: prev.items.filter((t) => t._id !== id),
      }));
      loadStats();
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  const startEdit = (todo) => {
    setEditId(todo._id);
    setTitle(todo.title);
  };

  const clearFilters = () => {
    setQ({ page: 1, limit: 5, status: "", from: "", to: "" });
  };

  const countCompleted = stats.byStatus.find((s) => s._id === true)?.count || 0;
  const countPending = stats.byStatus.find((s) => s._id === false)?.count || 0;

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-100 to-slate-200 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center text-slate-800">
          ✨ My Todo List
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-xl shadow-sm flex flex-col items-center">
            <ListTodo className="text-blue-600 mb-1" />
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-xl font-bold">{countCompleted + countPending}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl shadow-sm flex flex-col items-center">
            <CheckCircle2 className="text-green-600 mb-1" />
            <p className="text-sm text-slate-500">Completed</p>
            <p className="text-xl font-bold">{countCompleted}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl shadow-sm flex flex-col items-center">
            <Clock className="text-yellow-600 mb-1" />
            <p className="text-sm text-slate-500">Pending</p>
            <p className="text-xl font-bold">{countPending}</p>
          </div>
        </div>

        {/* Layout: left (list) - right (filters) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: form + list */}
          <div className="lg:col-span-3 space-y-6">
            {/* Form */}
            <form onSubmit={addOrUpdate} className="flex gap-3">
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Enter a new task..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md disabled:opacity-50"
              >
                <Plus size={18} />
                {editId ? "Update" : "Add"}
              </button>
            </form>

            {/* Todo List */}
            {loading ? (
              <p className="text-center text-slate-500">Loading...</p>
            ) : data.items.length === 0 ? (
              <p className="text-center text-slate-500">No tasks found</p>
            ) : (
              <ul className="space-y-3">
                {data.items.map((t) => (
                  <li
                    key={t._id}
                    className="p-4 border rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => toggle(t._id, t.completed)}
                          className="w-4 h-4"
                        />
                        <span
                          className={t.completed ? "line-through opacity-60" : ""}
                        >
                          {t.title}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        Created: {new Date(t.createdAt).toLocaleString()}
                      </span>
                      {t.dueAt && (
                        <span className="text-xs text-red-500">
                          Due: {new Date(t.dueAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => startEdit(t)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => remove(t._id)}
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 pt-6">
              <button
                disabled={q.page <= 1}
                onClick={() => setQ((s) => ({ ...s, page: s.page - 1 }))}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="font-medium">
                Page {data.page} / {data.pages}
              </span>
              <button
                disabled={q.page >= data.pages}
                onClick={() => setQ((s) => ({ ...s, page: s.page + 1 }))}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {/* Right: Filters */}
          <div className="lg:col-span-1">
            <div className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl shadow-md flex flex-col gap-4">
              <h2 className="flex items-center gap-2 text-slate-700 font-semibold">
                <Filter className="w-5 h-5 text-blue-600" />
                Filters
              </h2>

              {/* Status */}
              <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-white">
                <ListTodo className="text-slate-500 w-4 h-4" />
                <select
                  className="flex-1 outline-none"
                  value={q.status}
                  onChange={(e) =>
                    setQ((s) => ({ ...s, status: e.target.value, page: 1 }))
                  }
                >
                  <option value="">All</option>
                  <option value="true">Completed</option>
                  <option value="false">Pending</option>
                </select>
              </div>

              {/* From */}
              <div className="flex flex-col border rounded-lg px-3 py-2 bg-white">
                <label className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                  <Calendar className="text-slate-500 w-4 h-4" />
                  From date & time
                </label>
                <input
                  type="datetime-local"
                  className="outline-none border rounded px-2 py-1 text-sm"
                  value={q.from}
                  onChange={(e) =>
                    setQ((s) => ({ ...s, from: e.target.value, page: 1 }))
                  }
                />
              </div>

              {/* To */}
              <div className="flex flex-col border rounded-lg px-3 py-2 bg-white">
                <label className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                  <Calendar className="text-slate-500 w-4 h-4" />
                  To date & time
                </label>
                <input
                  type="datetime-local"
                  className="outline-none border rounded px-2 py-1 text-sm"
                  value={q.to}
                  onChange={(e) =>
                    setQ((s) => ({ ...s, to: e.target.value, page: 1 }))
                  }
                />
              </div>

              {/* Clear */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-medium text-sm mt-2"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
