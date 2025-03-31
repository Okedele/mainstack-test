import { Response } from "express";
import HttpStatusCodes from "../utils/HttpStatusCodes";

export default class Controller {

    protected sendServerError(res: Response, message: string) {
        return res.status(HttpStatusCodes.SERVER_ERROR).json(
            {
                status: false,
                message
            }
        );
    }

    protected sendSuccessResponse(res: Response, message: string, data: unknown, statusCode = HttpStatusCodes.OK) {
        return res.status(statusCode).json(
            {
                status: true,
                message,
                data
            }
        );
    }

    protected sendErrorResponse(res: Response, message: any, statusCode = HttpStatusCodes.BAD_REQUEST) {
        return res.status(statusCode).json(
            {
                status: false,
                message
            }
        )
    }

}