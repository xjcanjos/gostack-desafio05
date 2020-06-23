import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  private balance: Balance;

  constructor() {
    this.transactions = [];
    this.balance = { income: 0, outcome: 0, total: 0 };
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    this.balance = { income: 0, outcome: 0, total: 0 };
    this.transactions.map(transaction => {
      if (transaction.type === 'income') {
        this.balance.income += Number(transaction.value);
      }
      if (transaction.type === 'outcome') {
        this.balance.outcome += Number(transaction.value);
      }
    });

    this.balance.total = this.balance.income - this.balance.outcome;
    return this.balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (transaction.type === 'outcome') {
      this.balance = this.getBalance();
      if (this.balance.total < transaction.value)
        throw Error('Without balance to carry out the transaction');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
