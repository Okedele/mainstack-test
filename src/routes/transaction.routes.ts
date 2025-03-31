import { Application, Request, Response } from "express";
import { body, param, query } from "express-validator";
import authMiddleware from "../middleware/auth.middleware";
import TransactionController from "../controllers/transaction.controller";

export const TransactionRoutes = (Route: Application) => {
  Route.post(
    "/api/transaction/debit",
    authMiddleware as any,
    [body("accountId").isMongoId(), body("amount").isFloat({ min: 1 })],
    (req: Request, res: Response) => {
      return new TransactionController().debitTransaction(req, res);
    }
  );
  Route.post(
    "/api/transaction/credit",
    authMiddleware as any,
    [body("accountId").isMongoId(), body("amount").isFloat({ min: 1 })],
    (req: Request, res: Response) => {
      return new TransactionController().creditTransaction(req, res);
    }
  );

  Route.post(
    "/api/transaction/transfer",
    authMiddleware as any,
    [
      body("fromAccountId").isMongoId(),
      body("toAccountId").isMongoId(),
      body("amount").isFloat({ min: 1 }),
    ],
    (req: Request, res: Response) => {
      return new TransactionController().transferTransaction(req, res);
    }
  );

  Route.get(
    "/api/transactions",
    authMiddleware as any,
    [
      query("page").optional().isInt({ min: 1 }).toInt(),
      query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
      query("type").optional().isIn(["credit", "debit"]),
      query("accountId").optional().isMongoId(),
    ],
    (req: Request, res: Response) => {
      return new TransactionController().getUserTransactions(req, res);
    }
  );

  Route.get(
    "/api/transactions/:id",
    authMiddleware as any,
    [param("id").isMongoId()],
    (req: Request, res: Response) => {
      return new TransactionController().getTransaction(req, res);
    }
  );
};
