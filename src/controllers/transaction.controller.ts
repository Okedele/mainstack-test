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

      const transaction = await this.transactionService.creditTransaction(
        req.body,
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

      const transaction = await this.transactionService.debitTransaction(
        req.body,
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

      const transaction = await this.transactionService.transferTransaction(
        req.body,
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
