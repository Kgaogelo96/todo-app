// app/page.js
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [sort, setSort] = useState("dueDate");
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    topic: "",
  });

  async function loadTasks() {
    const res = await fetch(`/api/tasks?sort=${sort}`);
    setTasks(await res.json());
  }

  useEffect(() => {
    loadTasks();
  }, [sort]);

  async function handleCreate(e) {
    e.preventDefault();
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", dueDate: "", topic: "" });
    loadTasks();
  }

  async function handleStatusChange(id, status) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadTasks();
  }

  async function handleArchive(id) {
    await fetch(`/api/tasks/${id}/archive`, { method: "PATCH" });
    loadTasks();
  }

  const visible = tasks.filter((t) => !t.archived);

  return (
    <main
      style={{ maxWidth: 700, margin: "2rem auto", fontFamily: "sans-serif" }}
    >
      <h1>Todo</h1>

      <form onSubmit={handleCreate}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Topic"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          required
        />
        <input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>

      <div style={{ margin: "1rem 0" }}>
        Sort by: <button onClick={() => setSort("topic")}>Topic</button>{" "}
        <button onClick={() => setSort("status")}>Status</button>{" "}
        <button onClick={() => setSort("dueDate")}>Due date</button>
      </div>

      <table
        border="1"
        cellPadding="6"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Topic</th>
            <th>Due</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((t) => (
            <tr key={t.id} style={{ color: t.overdue ? "red" : "black" }}>
              <td>
                {t.title}
                {t.overdue ? " (overdue)" : ""}
              </td>
              <td>{t.topic}</td>
              <td>{new Date(t.dueDate).toLocaleDateString()}</td>
              <td>
                <select
                  value={t.status}
                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                >
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETE">Complete</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleArchive(t.id)}>Archive</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
