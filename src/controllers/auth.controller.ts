import { Request, Response } from "express";
import Controller from "./Controller";
import AuthService from "../services/auth.service";
import { validationResult } from "express-validator";

export default class AuthController extends Controller {
  private readonly authService: AuthService;

  public constructor() {
    super();
    this.authService = new AuthService();
  }

  public async register(req: Request, res: Response): Promise<any> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.sendErrorResponse(res, errors.array(), 400);
      }

      const registerUser = await this.authService.registerUser(req.body);
      if (!registerUser.status) {
        return this.sendErrorResponse(
          res,
          registerUser.message,
          registerUser.statusCode
        );
      }

      return this.sendSuccessResponse(
        res,
        registerUser.message,
        registerUser.data,
        registerUser.statusCode
      );
    } catch (err: any) {
      return this.sendServerError(res, err.message);
    }
  }

  public async login(req: Request, res: Response): Promise<any> {
    try {
      const loginUser = await this.authService.loginUser(req.body);
      if (!loginUser.status) {
        return this.sendErrorResponse(
          res,
          loginUser.message,
          loginUser.statusCode
        );
      }

      return this.sendSuccessResponse(
        res,
        loginUser.message,
        loginUser.data,
        loginUser.statusCode
      );
    } catch (err: any) {
      return this.sendServerError(res, err.message);
    }
  }
}
