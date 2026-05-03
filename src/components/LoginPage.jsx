"use client";

import { useState } from "react";
import styles from "./AuthPage.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage({ onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLoginSuccess();
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
            Welkom Bekk
            <em>Kerjain Woi</em>
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
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
          <p className={styles.switchText}>
            Belum punya akun?
            <button
              type="button"
              onClick={onSwitchToRegister}
              className={styles.switchButton}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
