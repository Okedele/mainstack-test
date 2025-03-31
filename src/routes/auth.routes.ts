import { Application, Request, Response } from "express";
import AuthController from "../controllers/auth.controller";
import { body } from "express-validator";

export const AuthRoutes = (Route: Application) => {
  Route.post(
    "/api/auth/register",
    [
      body("firstName").trim().isLength({ min: 3 }).escape(),
      body("lastName").trim().isLength({ min: 3 }).escape(),
      body("email").isEmail().normalizeEmail(),
      body("password").isLength({ min: 6 }),
    ],
    (req: Request, res: Response) => {
      return new AuthController().register(req, res);
    }
  );

  Route.post(
    "/api/auth/login",
    [
      body("email").isEmail().normalizeEmail(),
      body("password").isLength({ min: 6 }),
    ],
    (req: Request, res: Response) => {
      return new AuthController().login(req, res);
    }
  );
};
