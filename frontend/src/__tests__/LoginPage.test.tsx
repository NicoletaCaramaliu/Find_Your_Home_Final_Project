import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../pages/authPages/LoginPage";
import * as authService from "../services/authService";

// ✅ Mock LoginForm component
vi.mock("../components/login/LoginForm", () => {
  return {
    default: ({ onLogin, errorMessage, isLoading }: any) => {
      return (
        <div>
          <button onClick={() => onLogin("test@test.com", "password123")}>
            MockLogin
          </button>
          {errorMessage && <div>{errorMessage}</div>}
          {isLoading && <div>Loading...</div>}
        </div>
      );
    }
  };
});

// ✅ Mock Navbar și ThemeToggle
vi.mock("../components/NavBar", () => ({
  default: () => <div>MockNavBar</div>
}));

vi.mock("../components/ThemeToggle", () => ({
  default: () => <div>MockThemeToggle</div>
}));

describe("LoginPage", () => {
  it("apelează login corect", async () => {
    const mockLogin = vi.spyOn(authService, "login").mockResolvedValue({});

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("MockLogin"));
    expect(mockLogin).toHaveBeenCalledWith("test@test.com", "password123");
  });

  it("afișează eroare dacă login eșuează", async () => {
    vi.spyOn(authService, "login").mockRejectedValue(new Error("Eroare la login"));

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("MockLogin"));

    const errorElement = await screen.findByText("Eroare la login");
    expect(errorElement).toBeInTheDocument();
  });
});
