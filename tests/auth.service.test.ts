import AuthService from "../src/services/auth.service";
import User from "../src/models/User";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      const response = await authService.registerUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password123",
      });

      expect(response.status).toBe(true);
      expect(response.statusCode).toBe(201);
      expect(response.data.user.firstName).toBe("John");
      expect(response.data.user.lastName).toBe("Doe");
      expect(response.data.user.email).toBe("john@example.com");
    });

    it("should return an error if the email is already in use", async () => {
      await authService.registerUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password123",
      });

      const response = await authService.registerUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password123",
      });

      expect(response).toEqual({
        status: false,
        message: "Email already in use",
        statusCode: 400,
      });
    });
  });

  describe("loginUser", () => {
    it("should login a user successfully", async () => {
      await authService.registerUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password123",
      });

      const response = await authService.loginUser({
        email: "john@example.com",
        password: "Password123",
      });

      expect(response.status).toBe(true);
      expect(response.statusCode).toBe(200);
      expect(response.data.user.firstName).toBe("John");
      expect(response.data.user.lastName).toBe("Doe");
      expect(response.data.user.email).toBe("john@example.com");
    });

    it("should return an error if the user does not exist", async () => {
      const response = await authService.loginUser({
        email: "nonexistent@example.com",
        password: "Password123",
      });

      expect(response).toEqual({
        status: false,
        message: "Invalid credentials",
        statusCode: 400,
      });
    });

    it("should return an error if the password is incorrect", async () => {
      await authService.registerUser({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "Password123",
      });

      const response = await authService.loginUser({
        email: "john@example.com",
        password: "WrongPassword",
      });

      expect(response).toEqual({
        status: false,
        message: "Invalid credentials",
        statusCode: 400,
      });
    });
  });
});
