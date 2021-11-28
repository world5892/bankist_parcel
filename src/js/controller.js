'use strict';

import * as model from './model.js';
import View from './view.js';
import 'core-js';
import { LOGOUT_TIMER } from './config.js';

const controlLogin = function (username, password) {
  const activeUser = model.state.accounts.find(
    (account) => account.pin === +password && account.login === username
  );

  if (!activeUser) return;

  // activate logout timeout
  controlLogout();

  // Change active user
  model.loginUser(activeUser);

  // Display UI and welcome message
  View.renderUI(activeUser.owner);

  // Calculate balance
  model.calculateBalance();

  // Display balance
  View.renderBalance(activeUser);

  // Render movements
  View.renderMovements(activeUser);

  // Calculate summary
  model.calculateSummary();

  // Display summary
  View.renderSummary(activeUser);
};

const controlTransfer = function (transferTo, amount) {
  const { activeUser } = model.state;

  // Check if receiver exists
  const existingUser = model.state.accounts.find(
    (account) => account.login === transferTo
  );

  if (!existingUser || existingUser === activeUser) return;

  // Add movement to current user
  amount = +amount;

  // Add movement to current user
  model.addNegativeMovement(amount);

  // Add movement to recipient
  model.addPositiveMovement(transferTo, amount);

  // Update balance and summary
  model.updateBalanceAndSummary();

  // Update UI
  View.updateUI(activeUser);
};

const controlLoan = function (amount) {
  const { activeUser } = model.state;

  amount = +amount;

  // Check if loan can be granted
  const loanAllowed = model.allowLoan(amount);
  if (!loanAllowed) return;

  // Update balance and summary
  model.updateBalanceAndSummary();

  // Update UI
  View.updateUI(activeUser);
};

const controlClose = function (username, password) {
  password = +password;

  // Close current user account
  const isLoggedOut = model.closeAccount(username, password);

  // Log user out if they closed account
  if (!isLoggedOut) return;
  model.logoutUser();

  // Hide UI
  View.hideUI();
};

const controlLogout = function () {
  // Set session timer
  let logoutTimer = LOGOUT_TIMER;

  // Remove previous timer
  if (model.state.logoutTimerActivated) clearInterval(logoutID);

  // Update timer
  logoutID = setInterval(() => {
    logoutTimer--;

    let minutes = String(Math.trunc(logoutTimer / 60)).padStart(2, '0');
    // minutes < 10 ? (minutes = `0${minutes}`) : (minutes = minutes);

    let seconds = String(logoutTimer - minutes * 60).padStart(2, '0');
    // seconds < 10 ? (seconds = `0${seconds}`) : (seconds = seconds);

    if (logoutTimer === 0) {
      // Log user out when timer is up
      model.logoutUser();

      // Hide UI
      View.hideUI();

      // Remove timer
      clearInterval(logoutID);

      return;
    }

    View.updateTimer(`${minutes}:${seconds}`);
  }, 1000);
};

const controlSort = function () {
  const { activeUser } = model.state;

  // Sort by date
  if (activeUser.sortedByAmount) {
    activeUser.sortedByAmount = false; // shouldn't be mutated here
    View.renderMovements(activeUser);

    return;
  }

  // Sort according to amount (descending)
  activeUser.sortedByAmount = true;

  const sortedDescending = model.sortDescending();

  View.renderMovements(activeUser, sortedDescending);
};

const init = function () {
  View.addHandlerLogin(controlLogin);
  View.addHandlerTransfer(controlTransfer);
  View.addHandlerLoan(controlLoan);
  View.addHandlerClose(controlClose);
  View.addHandlerSort(controlSort);
};

init();
