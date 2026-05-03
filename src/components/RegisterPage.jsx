"use client";

import { useState } from "react";
import styles from "./AuthPage.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RegisterPage({ onRegisterSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onRegisterSuccess();
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        </header>
        <div className={styles.card}>
          <h1 className={styles.title}>
            Buat Akun Baru Kamu!
            <em>Kerjain tugas lu woi</em>
          </h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputWrap}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                disabled={loading}
                required
              />
            </div>
            <div className={styles.inputWrap}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                disabled={loading}
                required
              />
            </div>
            <div className={styles.inputWrap}>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                disabled={loading}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </button>
          </form>
          <p className={styles.switchText}>
            Sudah punya akun?
            <button
              type="button"
              onClick={onSwitchToLogin}
              className={styles.switchButton}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
