import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/authPages/RegisterPage";
import * as authService from "../services/authService";

vi.mock("../components/login/RegisterForm", () => {
  return {
    default: ({ onRegister, errorMessage }: any) => {
      return (
        <div>
          <button
            onClick={() =>
              onRegister("test@test.com", "password123", "JohnDoe", 2)
            }
          >
            MockRegister
          </button>
          {errorMessage && <div>{errorMessage}</div>}
        </div>
      );
    },
  };
});

vi.mock("../components/NavBar", () => ({
  default: () => <div>MockNavBar</div>,
}));

vi.mock("../components/ThemeToggle", () => ({
  default: () => <div>MockThemeToggle</div>,
}));

describe("RegisterPage", () => {
  it("apelează register corect", async () => {
    const mockRegister = vi
      .spyOn(authService, "register")
      .mockResolvedValue({});

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("MockRegister"));
    expect(mockRegister).toHaveBeenCalledWith(
      "test@test.com",
      "JohnDoe",
      "password123",
      2
    );
  });

  it("afișează eroare dacă register eșuează", async () => {
    vi.spyOn(authService, "register").mockRejectedValue(
      new Error("Eroare la înregistrare")
    );

    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("MockRegister"));

    const errorEl = await screen.findByText("Eroare la înregistrare");
    expect(errorEl).toBeInTheDocument();
  });
});
