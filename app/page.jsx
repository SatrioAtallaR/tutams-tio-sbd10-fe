"use client";

import { useState, useEffect } from "react";
import TodoApp from "../src/components/TodoApp";
import LoginPage from "../src/components/LoginPage";
import RegisterPage from "../src/components/RegisterPage";

export default function Page() {
  const [authState, setAuthState] = useState("loading");
  const [currentPage, setCurrentPage] = useState("login");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthState("authenticated");
    } else {
      setAuthState("unauthenticated");
    }
  }, []);

  if (authState === "loading") {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "18px",
        color: "#666"
      }}>
        Loading...
      </div>
    );
  }

  if (authState === "unauthenticated") {
    if (currentPage === "login") {
      return (
        <LoginPage
          onLoginSuccess={() => setAuthState("authenticated")}
          onSwitchToRegister={() => setCurrentPage("register")}
        />
      );
    } else {
      return (
        <RegisterPage
          onRegisterSuccess={() => setAuthState("authenticated")}
          onSwitchToLogin={() => setCurrentPage("login")}
        />
      );
    }
  }

  return (
    <TodoApp
      onLogout={() => {
        setAuthState("unauthenticated");
        setCurrentPage("login");
      }}
    />
  );
}