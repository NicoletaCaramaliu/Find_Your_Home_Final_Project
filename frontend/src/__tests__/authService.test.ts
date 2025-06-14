import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("../utils/parseError", () => ({
  parseError: vi.fn(() => "Eroare generică"),
}));

import { login, logout, register } from "../services/authService";
const mockedApi = (await import("../api")).default;
const mockedPost = mockedApi.post as unknown as ReturnType<typeof vi.fn>;

describe("authService logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("login", () => {
    it("should login and store user data", async () => {
      mockedPost.mockResolvedValue({
        data: {
          token: "token123",
          user: { id: "1", role: "admin" },
        },
      });

      const result = await login("test@email.com", "password123");

      expect(mockedPost).toHaveBeenCalledWith("/Auth/login", {
        email: "test@email.com",
        password: "password123",
      });
      expect(localStorage.getItem("token")).toBe("token123");
      expect(localStorage.getItem("userId")).toBe("1");
      expect(localStorage.getItem("userRole")).toBe("admin");
      expect(result.user.role).toBe("admin");
    });

    it("should throw parsed error on login failure", async () => {
      mockedPost.mockRejectedValue(new Error("fail"));
      await expect(login("fail@email.com", "fail")).rejects.toThrow("Eroare generică");
    });
  });

  describe("logout", () => {
    it("should call API and clear token", async () => {
      localStorage.setItem("token", "123");
      mockedPost.mockResolvedValue({});

      await logout();

      expect(mockedPost).toHaveBeenCalledWith("/Auth/logout");
      expect(localStorage.getItem("token")).toBeNull();
    });

    it("should throw error on logout failure", async () => {
      mockedPost.mockRejectedValue(new Error("fail"));
      await expect(logout()).rejects.toThrow("Eroare generică");
    });
  });

  describe("register", () => {
    it("should register a user", async () => {
      mockedPost.mockResolvedValue({ data: { success: true } });

      const result = await register("e@email.com", "username", "password", 2);
      expect(mockedPost).toHaveBeenCalledWith("/Auth/register", {
        email: "e@email.com",
        username: "username",
        password: "password",
        role: 2,
      });
      expect(result).toEqual({ success: true });
    });

    it("should throw error on register failure", async () => {
      mockedPost.mockRejectedValue(new Error("fail"));
      await expect(register("a", "b", "c", 1)).rejects.toThrow("Eroare generică");
    });
  });
});
