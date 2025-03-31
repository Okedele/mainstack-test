import User from "../models/User";
import { comparePasswords, generateToken, hashPassword } from "../utils/auth";
import HttpStatusCodes from "../utils/HttpStatusCodes";

export default class AuthService {

  public async registerUser(payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{
    status: boolean;
    message: string;
    statusCode?: number;
    data?: any;
  }> {
    try {
      const { firstName, lastName, email, password } = payload;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          status: false,
          message: "Email already in use",
          statusCode: 400,
        };
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create new user
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        passwordHash,
      });

      // Generate JWT token
      const token = generateToken(newUser.id);

      const data = {
        token,
        user: { id: newUser.id, firstName, lastName, email },
      };

      return {
        status: true,
        data,
        statusCode: HttpStatusCodes.CREATED,
        message: "User created successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
        statusCode: err.status || HttpStatusCodes.SERVER_ERROR,
      };
    }
  }
  
  public async loginUser(payload: {
    email: string;
    password: string;
  }): Promise<{
    status: boolean;
    message: string;
    statusCode?: number;
    data?: any;
  }> {
    try {
      const { email, password } = payload;
      
          // Find user
          const user = await User.findOne({ email });
          if (!user) {
            return {
              status: false,
              message: "Invalid credentials",
              statusCode: 400,
            };
          }
      
          // Compare password
          const isMatch = await comparePasswords(password, user.passwordHash);
          if (!isMatch) {
            return {
              status: false,
              message: "Invalid credentials",
              statusCode: 400,
            };
          }
      
          // Generate token
          const token = generateToken(user.id);
      
          const data = {
            token,
            user: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            },
          };

      return {
        status: true,
        data,
        statusCode: HttpStatusCodes.OK,
        message: "User logged in successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
        statusCode: err.status || HttpStatusCodes.SERVER_ERROR,
      };
    }
  }
}
