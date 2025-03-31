import { Application, Request, Response } from "express";
import { body } from "express-validator";
import AccountController from "../controllers/account.controller";
import authMiddleware from "../middleware/auth.middleware";

export const AccountRoutes = (Route: Application) => {
  Route.post(
    "/api/accounts",
    authMiddleware as any,
    [
      body("currency").isIn(['USD', 'NGN']),
    ],
    (req: Request, res: Response) => {
      return new AccountController().createAccount(req, res);
    }
  );

  Route.get(
    "/api/accounts",
    authMiddleware as any,
    (req: Request, res: Response) => {
      return new AccountController().getUserAccounts(req, res);
    }
  );
};
