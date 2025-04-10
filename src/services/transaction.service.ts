import mongoose from "mongoose";
import Account from "../models/Account";
import HttpStatusCodes from "../utils/HttpStatusCodes";
import Transaction from "../models/Transaction";

export default class TransactionService {
  public async creditTransaction(
    payload: {
      accountId: string;
      amount: number;
    },
    userId: string
  ): Promise<{
    status: boolean;
    message: string;
    statusCode?: number;
    data?: any;
  }> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { accountId, amount } = payload;

      const account = await Account.findOne({
        userId: userId,
        _id: accountId,
      }).session(session);

      if (!account) {
        await session.abortTransaction();
        return {
          status: false,
          message: "Account not found",
          statusCode: 400,
        };
      }

      // Update account balance
      account.balance += amount;
      await account.save({ session });

      // Record transaction
      const transaction = await Transaction.create(
        [
          {
            type: "credit",
            amount,
            currency: account.currency,
            toAccount: account._id,
            userId: userId,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        status: true,
        data: transaction,
        statusCode: HttpStatusCodes.OK,
        message: "Credit transaction performed successfully!",
      };
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      return {
        status: false,
        message: err.message,
        statusCode: err.status || HttpStatusCodes.SERVER_ERROR,
      };
    }
  }

  public async debitTransaction(
    payload: {
      accountId: string;
      amount: number;
    },
    userId: string
  ): Promise<{
    status: boolean;
    message: string;
    statusCode?: number;
    data?: any;
  }> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { accountId, amount } = payload;

      const account = await Account.findOne({
        userId: userId,
        _id: accountId,
      }).session(session);

      if (!account) {
        await session.abortTransaction();
        return {
          status: false,
          message: "Account not found",
          statusCode: 400,
        };
      }

      if (account.balance < amount) {
        await session.abortTransaction();
        return {
          status: false,
          message: "Insufficient balance",
          statusCode: 400,
        };
      }

      // Update account balance
      account.balance -= amount;
      await account.save({ session });

      // Record transaction
      const transaction = await Transaction.create(
        [
          {
            type: "debit",
            amount,
            currency: account.currency,
            fromAccount: account._id,
            userId: userId,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        status: true,
        data: transaction,
        statusCode: HttpStatusCodes.OK,
        message: "Debit transaction performed successfully!",
      };
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      return {
        status: false,
        message: err.message,
        statusCode: err.status || HttpStatusCodes.SERVER_ERROR,
      };
    }
  }

  public async transferTransaction(
    payload: {
      fromAccountId: string;
      toAccountId: string;
      amount: number;
    },
    userId: string
  ): Promise<{
    status: boolean;
    message: string;
    statusCode?: number;
    data?: any;
  }> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { fromAccountId, toAccountId, amount } = payload;

      const fromAccount = await Account.findOne({
        userId: userId,
        _id: fromAccountId,
      }).session(session);
      const toAccount = await Account.findById(toAccountId).session(session);

      if (!fromAccount) {
        await session.abortTransaction();
        return {
          status: false,
          message: "Source account not found",
          statusCode: 400,
        };
      }

      if (!toAccount) {
        await session.abortTransaction();
        return {
          status: false,
          message: "Destination account not found",
          statusCode: 400,
        };
      }

      if (fromAccount.balance < amount) {
        await session.abortTransaction();
        return {
          status: false,
          message: "Insufficient balance for transfer",
          statusCode: 400,
        };
      }

      if (fromAccount.currency !== toAccount.currency) {
        await session.abortTransaction();
        return {
          status: false,
          message: "Source and destination accounts currency does not match",
          statusCode: 400,
        };
      }

      // Perform debit and credit
      fromAccount.balance -= amount;
      toAccount.balance += amount;

      await fromAccount.save({ session });
      await toAccount.save({ session });

      // Record debit transaction for source account
      const debitTransaction = await Transaction.create(
        [
          {
            type: "debit",
            amount,
            currency: fromAccount.currency,
            fromAccount: fromAccount._id,
            toAccount: toAccount._id,
            userId: userId,
          },
        ],
        { session }
      );

      // Record credit transaction for destination account
      const creditTransaction = await Transaction.create(
        [
          {
            type: "credit",
            amount,
            currency: fromAccount.currency,
            fromAccount: fromAccount._id,
            toAccount: toAccount._id,
            userId: userId,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return {
        status: true,
        data: { debitTransaction, creditTransaction },
        statusCode: HttpStatusCodes.OK,
        message: "Transfer transaction performed successfully!",
      };
    } catch (err: any) {
      await session.abortTransaction();
      session.endSession();
      return {
        status: false,
        message: err.message,
        statusCode: err.status || HttpStatusCodes.SERVER_ERROR,
      };
    }
  }

  public async getUserTransactions(
    userId: string,
    query: {
      page: number;
      limit: number;
      type: string;
      accountId: string;
    }
  ): Promise<{
    status: boolean;
    message: string;
    statusCode?: number;
    data?: any;
  }> {
    try {
      const { page, limit, type, accountId } = query;
      const skip = (page - 1) * limit;

      const queries: any = { userId };
      if (type) {
        queries.type = type;
      }

      if (accountId) {
        queries.$or = [{ fromAccount: accountId }, { toAccount: accountId }];
      }

      const transactions = await Transaction.find(queries)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Transaction.countDocuments(queries);

      const data = {
        transactions,
        meta: {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
        },
      };

      return {
        status: true,
        data,
        statusCode: HttpStatusCodes.OK,
        message: "User transactions fetched successfully!",
      };
    } catch (err: any) {
      return {
        status: false,
        message: err.message,
        statusCode: err.status || HttpStatusCodes.SERVER_ERROR,
      };
    }
  }

  public async getTransaction(
    userId: string,
    transactionId: string
  ): Promise<{
    status: boolean;
    message: string;
    statusCode?: number;
    data?: any;
  }> {
    try {
      const transaction = await Transaction.findOne({
        _id: transactionId,
        userId: userId,
      });

      return {
        status: true,
        data: transaction,
        statusCode: HttpStatusCodes.OK,
        message: "Transaction fetched successfully!",
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
