"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./TodoApp.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M5.5 1.5h4m-7 2h10M10 4.5l-.5 8h-4l-.5-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9.5 1.5L12.5 4.5L4.5 12.5H1.5V9.5L9.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7L5.5 10.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function TodoApp({ onLogout }) {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);
  const editInputRef = useRef(null);
  const addInputRef = useRef(null);

  const getHeaders = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
    };
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/todos`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch todos");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError("Gagal memuat data. Pastikan backend berjalan.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ title: title.trim() }),
      });
      if (!res.ok) throw new Error("Failed to add todo");
      const newTodo = await res.json();
      setTodos([newTodo, ...todos]);
      setTitle("");
      addInputRef.current?.focus();
    } catch (err) {
      setError("Gagal menambah todo.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleComplete = async (todo) => {
    const updated = { ...todo, completed: !todo.completed };
    setTodos(todos.map(t => t.id === todo.id ? updated : t));
    try {
      const res = await fetch(`${API_URL}/todos/${todo.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTodos(todos.map(t => t.id === todo.id ? data : t));
    } catch {
      setTodos(todos.map(t => t.id === todo.id ? todo : t));
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return cancelEdit();
    const old = todos.find(t => t.id === id);
    setTodos(todos.map(t => t.id === id ? { ...t, title: editTitle.trim() } : t));
    setEditingId(null);
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTodos(todos.map(t => t.id === id ? data : t));
    } catch {
      setTodos(todos.map(t => t.id === id ? old : t));
      setError("Gagal menyimpan perubahan.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const deleteTodo = async (id) => {
    const prev = todos;
    setTodos(todos.filter(t => t.id !== id));
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error();
    } catch {
      setTodos(prev);
      setError("Gagal menghapus todo.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  };

  const filteredTodos = todos.filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const doneCount = todos.filter(t => t.completed).length;

  return (
    <div className={styles.page}>
      <div className={styles.blobLeft} />
      <div className={styles.blobRight} />

      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>✦</span>
            <span className={styles.logoText}>KerjainWoi!</span>
          </div>
          <div className={styles.stats}>
            <span className={styles.statPill}>
              <span className={styles.statDot} style={{ background: "var(--accent)" }} />
              {activeCount} aktif
            </span>
            <span className={styles.statPill}>
              <span className={styles.statDot} style={{ background: "var(--success)" }} />
              {doneCount} selesai
            </span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </header>

        <main className={styles.card}>
          <h1 className={styles.title}>
            Apa yang perlu<br />
            <em>diselesaikan hari ini?</em>
          </h1>

          <form onSubmit={addTodo} className={styles.form}>
            <div className={styles.inputWrap}>
              <input
                ref={addInputRef}
                type="text"
                placeholder="Tambah tugas baru..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={styles.input}
                maxLength={200}
                disabled={submitting}
              />
            </div>
            <button type="submit" className={styles.addBtn} disabled={submitting || !title.trim()}>
              {submitting ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  <span>+</span>
                  <span>Tambah</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className={styles.errorBanner}>
              <span>{error}</span>
              <button onClick={() => setError(null)} className={styles.errorClose}>x</button>
            </div>
          )}

          {todos.length > 0 && (
            <div className={styles.tabs}>
              {["all", "active", "done"].map(f => (
                <button
                  key={f}
                  className={`${styles.tab} ${filter === f ? styles.tabActive : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "Semua" : f === "active" ? "Aktif" : "Selesai"}
                  <span className={styles.tabCount}>
                    {f === "all" ? todos.length : f === "active" ? activeCount : doneCount}
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className={styles.list}>
            {loading ? (
              <div className={styles.empty}>
                <div className={styles.loadingDots}>
                  <span /><span /><span />
                </div>
                <p>Memuat data...</p>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  {filter === "done" ? "selesai" : filter === "active" ? "lanjut" : "kosong"}
                </div>
                <p className={styles.emptyTitle}>
                  {filter === "done" ? "Belum ada tugas selesai" : filter === "active" ? "Semua sudah selesai" : "Belum ada tugas"}
                </p>
                <p className={styles.emptySubtitle}>
                  {filter === "all" ? "Tambah tugas pertamamu di atas" : ""}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo, i) => (
                <div
                  key={todo.id}
                  className={`${styles.item} ${todo.completed ? styles.itemDone : ""}`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <button
                    className={`${styles.checkbox} ${todo.completed ? styles.checkboxDone : ""}`}
                    onClick={() => toggleComplete(todo)}
                    aria-label="Toggle complete"
                  >
                    {todo.completed && <CheckIcon />}
                  </button>

                  {editingId === todo.id ? (
                    <input
                      ref={editInputRef}
                      className={styles.editInput}
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") saveEdit(todo.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      maxLength={200}
                    />
                  ) : (
                    <span
                      className={styles.itemText}
                      onDoubleClick={() => !todo.completed && startEdit(todo)}
                    >
                      {todo.title}
                    </span>
                  )}

                  <div className={styles.actions}>
                    {editingId === todo.id ? (
                      <>
                        <button
                          className={`${styles.actionBtn} ${styles.saveBtn}`}
                          onClick={() => saveEdit(todo.id)}
                          title="Simpan"
                        >
                          <SaveIcon />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.cancelBtn}`}
                          onClick={cancelEdit}
                          title="Batal"
                        >
                          x
                        </button>
                      </>
                    ) : (
                      <>
                        {!todo.completed && (
                          <button
                            className={`${styles.actionBtn} ${styles.editBtn}`}
                            onClick={() => startEdit(todo)}
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                        )}
                        <button
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          onClick={() => deleteTodo(todo.id)}
                          title="Hapus"
                        >
                          <TrashIcon />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && todos.length > 0 && (
            <p className={styles.tip}>
              Tip: double-click teks untuk edit cepat
            </p>
          )}
        </main>

        <footer className={styles.footer}>
          Built with Next.js + Express + PostgreSQL
        </footer>
      </div>
    </div>
  );
}
