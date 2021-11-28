import { MAX_LOAN } from './config.js';

// Data
export const state = {
  accounts: [
    {
      owner: 'Jonas Schmedtmann',
      movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
      interestRate: 1.2, // %
      login: 'js',
      pin: 1111,
      movementsDates: [
        '2020-07-26T12:01:20.894Z',
        '2020-06-25T18:49:59.371Z',
        '2020-04-10T14:43:26.374Z',
        '2020-02-05T16:33:06.386Z',
        '2020-01-25T14:18:46.235Z',
        '2019-12-25T06:04:23.907Z',
        '2019-11-30T09:48:16.867Z',
        '2019-11-01T13:15:33.035Z',
      ],
      sortedByAmount: false,
      locale: 'de-DE',
      currency: 'EUR',
    },

    {
      owner: 'Jessica Davis',
      movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
      interestRate: 1.5,
      login: 'jd',
      pin: 2222,
      movementsDates: [
        '2020-07-26T12:01:20.894Z',
        '2020-06-25T18:49:59.371Z',
        '2020-04-10T14:43:26.374Z',
        '2020-02-05T16:33:06.386Z',
        '2020-01-25T14:18:46.235Z',
        '2019-12-25T06:04:23.907Z',
        '2019-11-30T09:48:16.867Z',
        '2019-11-01T13:15:33.035Z',
      ],
      sortedByAmount: false,
      locale: 'en-US',
      currency: 'USD',
    },

    {
      owner: 'Steven Thomas Williams',
      movements: [200, -200, 340, -300, -20, 50, 400, -460],
      interestRate: 0.7,
      login: 'st',
      pin: 3333,
      movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
      ],
      sortedByAmount: false,
      locale: 'en-GB',
      currency: 'GBP',
    },

    {
      owner: 'Sarah Smith',
      movements: [430, 1000, 700, 50, 90],
      interestRate: 1,
      login: 'ss',
      pin: 4444,
      movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
      ],
      sortedByAmount: false,
      locale: 'pl-PL',
      currency: 'PLN',
    },
  ],

  activeUser: null,
  logoutTimerActivated: false,
};

export const loginUser = function (activeUser) {
  state.activeUser = activeUser;
  state.logoutTimerActivated = true;
};

export const calculateBalance = function () {
  const balance = state.activeUser.movements.reduce(
    (total, current) => total + current,
    0
  );
  state.activeUser.balance = balance;
};

export const calculateSummary = function () {
  // Calculate total of in transactions
  const ins = state.activeUser.movements.filter((mov) => mov > 0);
  const inSum = ins.reduce((total, current) => total + current, 0);
  state.activeUser.inSum = inSum;

  // Calculate total of out transactions
  const outs = state.activeUser.movements.filter((mov) => mov < 0);
  const outSum = outs.reduce((total, current) => total + current, 0);
  state.activeUser.outSum = outSum;

  // Calculate (fake) interests
  const interests =
    state.activeUser.inSum * (state.activeUser.interestRate / 100);
  state.activeUser.interests = interests;
};

export const addPositiveMovement = function (transferTo, amount) {
  const recipient = state.accounts.find(
    (account) => account.login === transferTo
  );
  recipient.movements = [amount, ...recipient.movements];
  recipient.movementsDates = [new Date(), ...recipient.movementsDates];
};

export const addNegativeMovement = function (amount) {
  // Check if not higher than balance
  if (amount > state.activeUser.balance)
    return alert('Your balance is too low to make the transfer');

  state.activeUser.movements = [-amount, ...state.activeUser.movements];
  state.activeUser.movementsDates = [
    new Date(),
    ...state.activeUser.movementsDates,
  ];
};

export const updateBalanceAndSummary = function () {
  calculateBalance();
  calculateSummary();
};

export const allowLoan = function (amount) {
  const allowedAmount = state.activeUser.balance * MAX_LOAN; // max possible loan amount

  if (allowedAmount < amount) return;

  state.activeUser.movements = [amount, ...state.activeUser.movements];
  state.activeUser.movementsDates = [
    new Date(),
    ...state.activeUser.movementsDates,
  ];

  return true;
};

export const sortDescending = function () {
  let movementsCopy = [...state.activeUser.movements];
  const sortedDescending = movementsCopy.sort((a, b) => b - a);
  return sortedDescending;
};

export const closeAccount = function (username, password) {
  // Check if passed data is correct
  if (username !== state.activeUser.login || password !== state.activeUser.pin)
    return false;

  // Confirmation from user
  const confirmation = confirm('Are you sure you want to close your account?');
  if (!confirmation) return false;

  // Delete active user account
  state.accounts = state.accounts.filter(
    (account) => account !== state.activeUser
  );

  return true;
};

export const logoutUser = function () {
  state.activeUser = null;
};
