import mongoose from "mongoose";
import TransactionService from "../src/services/transaction.service";
import Account from "../src/models/Account";
import Transaction from "../src/models/Transaction";

const transactionService = new TransactionService();

describe("Transaction Service", () => {
  let userId: string;
  let accountId: string;
  let toAccountId: string;

  beforeAll(async () => {
    userId = new mongoose.Types.ObjectId().toString();

    // Create test accounts
    const account = await Account.create({
      userId,
      balance: 1000,
      currency: "USD",
    });
    const toAccount = await Account.create({
      userId,
      balance: 500,
      currency: "USD",
    });

    accountId = account._id.toString();
    toAccountId = toAccount._id.toString();
  });

  afterEach(async () => {
    await Transaction.deleteMany({});
    await Account.updateMany({}, { balance: 1000 });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should credit an account successfully", async () => {
    const result = await transactionService.creditTransaction(
      { accountId, amount: 200 },
      userId
    );

    expect(result.status).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.data[0].type).toBe("credit");

    const account = await Account.findById(accountId);
    expect(account?.balance).toBe(1200);
  });

  it("should debit an account successfully", async () => {
    const result = await transactionService.debitTransaction(
      { accountId, amount: 300 },
      userId
    );

    expect(result.status).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.data[0].type).toBe("debit");

    const account = await Account.findById(accountId);
    expect(account?.balance).toBe(700);
  });

  it("should fail debit due to insufficient balance", async () => {
    const result = await transactionService.debitTransaction(
      { accountId, amount: 2000 },
      userId
    );

    expect(result.status).toBe(false);
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe("Insufficient balance");

    const account = await Account.findById(accountId);
    expect(account?.balance).toBe(1000);
  });

  it("should transfer funds between accounts", async () => {
    const result = await transactionService.transferTransaction(
      { fromAccountId: accountId, toAccountId, amount: 200 },
      userId
    );

    expect(result.status).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.data.debitTransaction[0].type).toBe("debit");
    expect(result.data.creditTransaction[0].type).toBe("credit");

    const fromAccount = await Account.findById(accountId);
    const toAccount = await Account.findById(toAccountId);

    expect(fromAccount?.balance).toBe(800);
    expect(toAccount?.balance).toBe(1200);
  });

  it("should return user transactions with pagination", async () => {
    await transactionService.creditTransaction(
      { accountId, amount: 200 },
      userId
    );
    await transactionService.debitTransaction(
      { accountId, amount: 100 },
      userId
    );

    const result = await transactionService.getUserTransactions(userId, {
      page: 1,
      limit: 10,
      type: "",
      accountId,
    });

    expect(result.status).toBe(true);
    expect(result.data.transactions.length).toBe(2);
    expect(result.data.meta.totalRecords).toBe(2);
  });

  it("should fetch a specific transaction", async () => {
    const transactionRes = await transactionService.creditTransaction(
      { accountId, amount: 200 },
      userId
    );
    const transactionId = transactionRes.data[0]._id.toString();

    const result = await transactionService.getTransaction(
      userId,
      transactionId
    );

    expect(result.status).toBe(true);
    expect(result.data.amount).toBe(200);
  });
});
