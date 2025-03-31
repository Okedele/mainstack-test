import Account from "../models/Account";
import HttpStatusCodes from "../utils/HttpStatusCodes";

export default class AccountService {
  public async createAccount(
    payload: {
      currency: string;
    },
    userId: string
  ): Promise<{
    status: boolean;
    message: string;
    statusCode?: number;
    data?: any;
  }> {
    try {
      const { currency } = payload;

      // Check if user already has an account in the given currency
      const existingAccount = await Account.findOne({
        userId: userId,
        currency,
      });
      if (existingAccount) {
        return {
          status: false,
          message: "Account already exists for user in this currency",
          statusCode: 400,
        };
      }

      // Create new account
      const account = await Account.create({
        userId: userId,
        balance: 0,
        currency,
      });

      return {
        status: true,
        data: account,
        statusCode: HttpStatusCodes.CREATED,
        message: "Account created successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
        statusCode: err.status || HttpStatusCodes.SERVER_ERROR,
      };
    }
  }

  public async getUserAccounts(userId: string): Promise<{
    status: boolean;
    message: string;
    statusCode?: number;
    data?: any;
  }> {
    try {
      const accounts = await Account.find({ userId: userId });

      return {
        status: true,
        data: accounts,
        statusCode: HttpStatusCodes.OK,
        message: "User accounts successfully!",
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
