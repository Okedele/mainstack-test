import { Request, Response } from "express";
import Controller from "./Controller";
import { validationResult } from "express-validator";
import TransactionService from "../services/transaction.service";

export default class TransactionController extends Controller {
  private readonly transactionService: TransactionService;

  public constructor() {
    super();
    this.transactionService = new TransactionService();
  }

  public async creditTransaction(req: Request, res: Response): Promise<any> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.sendErrorResponse(res, errors.array(), 400);
      }

      const userId = (req as any).user.id;

      const transaction = await this.transactionService.creditTransaction(
        req.body,
        userId
      );
      if (!transaction.status) {
        return this.sendErrorResponse(
          res,
          transaction.message,
          transaction.statusCode
        );
      }

      return this.sendSuccessResponse(
        res,
        transaction.message,
        transaction.data,
        transaction.statusCode
      );
    } catch (err: any) {
      return this.sendServerError(res, err.message);
    }
  }

  public async debitTransaction(req: Request, res: Response): Promise<any> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.sendErrorResponse(res, errors.array(), 400);
      }

      const userId = (req as any).user.id;

      const transaction = await this.transactionService.debitTransaction(
        req.body,
        userId
      );
      if (!transaction.status) {
        return this.sendErrorResponse(
          res,
          transaction.message,
          transaction.statusCode
        );
      }

      return this.sendSuccessResponse(
        res,
        transaction.message,
        transaction.data,
        transaction.statusCode
      );
    } catch (err: any) {
      return this.sendServerError(res, err.message);
    }
  }

  public async transferTransaction(req: Request, res: Response): Promise<any> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.sendErrorResponse(res, errors.array(), 400);
      }

      const userId = (req as any).user.id;

      const transaction = await this.transactionService.transferTransaction(
        req.body,
        userId
      );
      if (!transaction.status) {
        return this.sendErrorResponse(
          res,
          transaction.message,
          transaction.statusCode
        );
      }

      return this.sendSuccessResponse(
        res,
        transaction.message,
        transaction.data,
        transaction.statusCode
      );
    } catch (err: any) {
      return this.sendServerError(res, err.message);
    }
  }

  public async getUserTransactions(req: Request, res: Response): Promise<any> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return this.sendErrorResponse(res, errors.array(), 400);
      }

      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const type = req.query.type as string;

      const transaction = await this.transactionService.getUserTransactions(
        userId,
        page,
        limit,
        type
      );
      if (!transaction.status) {
        return this.sendErrorResponse(
          res,
          transaction.message,
          transaction.statusCode
        );
      }

      return this.sendSuccessResponse(
        res,
        transaction.message,
        transaction.data,
        transaction.statusCode
      );
    } catch (err: any) {
      return this.sendServerError(res, err.message);
    }
  }
}
