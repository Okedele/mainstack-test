import { Application, Request, Response } from "express";
import { body } from "express-validator";
import authMiddleware from "../middleware/auth.middleware";
import TransactionController from "../controllers/transaction.controller";

export const TransactionRoutes = (Route: Application) => {
  Route.post(
    "/api/transaction/debit",
    authMiddleware as any,
    [
      body('accountId').isMongoId(),
      body('amount').isFloat({ min: 1 }),
    ],
    (req: Request, res: Response) => {
      return new TransactionController().debitTransaction(req, res);
    }
  );
  Route.post(
    "/api/transaction/credit",
    authMiddleware as any,
    [
      body('accountId').isMongoId(),
      body('amount').isFloat({ min: 1 }),
    ],
    (req: Request, res: Response) => {
      return new TransactionController().creditTransaction(req, res);
    }
  );

  Route.get(
    "/api/transaction/transfer",
    authMiddleware as any,
    (req: Request, res: Response) => {
      return new TransactionController().transferTransaction(req, res);
    }
  );
};
