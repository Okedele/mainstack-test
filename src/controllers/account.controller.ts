import { Request, Response } from "express";
import Controller from "./Controller";
import { validationResult } from "express-validator";
import AccountService from "../services/account.service";

export default class AccountController extends Controller {
  private readonly accountService: AccountService;

  public constructor() {
    super();
    this.accountService = new AccountService();
  }

  public async createAccount(req: Request, res: Response): Promise<any> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.sendErrorResponse(res, errors.array(), 400);
      }

      const userId = (req as any).user.id;

      const createAccount = await this.accountService.createAccount(
        req.body,
        userId
      );
      if (!createAccount.status) {
        return this.sendErrorResponse(
          res,
          createAccount.message,
          createAccount.statusCode
        );
      }

      return this.sendSuccessResponse(
        res,
        createAccount.message,
        createAccount.data,
        createAccount.statusCode
      );
    } catch (err: any) {
      return this.sendServerError(res, err.message);
    }
  }

  public async getUserAccounts(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req as any).user.id;
      const accounts = await this.accountService.getUserAccounts(userId);
      if (!accounts.status) {
        return this.sendErrorResponse(
          res,
          accounts.message,
          accounts.statusCode
        );
      }

      return this.sendSuccessResponse(
        res,
        accounts.message,
        accounts.data,
        accounts.statusCode
      );
    } catch (err: any) {
      return this.sendServerError(res, err.message);
    }
  }

  public async getAccount(req: Request, res: Response): Promise<any> {
    try {
      const userId = (req as any).user.id;
      const accountId = req.params.id as string

      const account = await this.accountService.getAccount(userId, accountId);
      if (!account.status) {
        return this.sendErrorResponse(
          res,
          account.message,
          account.statusCode
        );
      }

      return this.sendSuccessResponse(
        res,
        account.message,
        account.data,
        account.statusCode
      );
    } catch (err: any) {
      return this.sendServerError(res, err.message);
    }
  }
}
