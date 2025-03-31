import AccountService from '../src/services/account.service';
import Account from '../src/models/Account';
import mongoose from 'mongoose';

const accountService = new AccountService();

describe('Account Service', () => {
  let userId: string;

  beforeAll(async () => {
    userId = new mongoose.Types.ObjectId().toString();
  });

  afterEach(async () => {
    await Account.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new account successfully', async () => {
    const result = await accountService.createAccount({ currency: 'USD' }, userId);

    expect(result.status).toBe(true);
    expect(result.statusCode).toBe(201);
    expect(result.data.currency).toBe('USD');
    expect(result.data.balance).toBe(0);
  });

  it('should not allow duplicate accounts in the same currency', async () => {
    await accountService.createAccount({ currency: 'USD' }, userId);
    const result = await accountService.createAccount({ currency: 'USD' }, userId);

    expect(result.status).toBe(false);
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('Account already exists for user in this currency');
  });

  it('should fetch all accounts for a user', async () => {
    await accountService.createAccount({ currency: 'USD' }, userId);
    await accountService.createAccount({ currency: 'NGN' }, userId);

    const result = await accountService.getUserAccounts(userId);

    expect(result.status).toBe(true);
    expect(result.data.length).toBe(2);
  });

  it('should fetch an account by ID', async () => {
    const accountRes = await accountService.createAccount({ currency: 'USD' }, userId);
    const accountId = accountRes.data._id.toString();

    const result = await accountService.getAccount(userId, accountId);

    expect(result.status).toBe(true);
    expect(result.data.currency).toBe('USD');
  });

  it('should return null for a non-existent account', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const result = await accountService.getAccount(userId, fakeId);

    expect(result.status).toBe(true);
    expect(result.data).toBeNull();
  });
});
