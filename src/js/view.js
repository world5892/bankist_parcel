class View {
  // HTML Elements
  #labelWelcome = document.querySelector('.welcome');
  #labelBalance = document.querySelector('.balance__value');
  #labelSumIn = document.querySelector('.summary__value--in');
  #labelSumOut = document.querySelector('.summary__value--out');
  #labelSumInterest = document.querySelector('.summary__value--interest');
  #labelTimer = document.querySelector('.timer');
  #labelDate = document.querySelector('.balance__date');

  #containerApp = document.querySelector('.app');
  #containerMovements = document.querySelector('.movements');

  #formLogin = document.querySelector('.login');
  #formTransfer = document.querySelector('.form--transfer');
  #formLoan = document.querySelector('.form--loan');
  #formClose = document.querySelector('.form--close');

  #btnSort = document.querySelector('.btn--sort');

  #inputLoginUsername = document.querySelector('.login__input--user');
  #inputLoginPin = document.querySelector('.login__input--pin');
  #inputTransferTo = document.querySelector('.form__input--to');
  #inputTransferAmount = document.querySelector('.form__input--amount');
  #inputLoanAmount = document.querySelector('.form__input--loan-amount');
  #inputCloseUsername = document.querySelector('.form__input--user');
  #inputClosePin = document.querySelector('.form__input--pin');

  // Click handlers
  addHandlerLogin(handler) {
    this.#formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      handler(this.#inputLoginUsername.value, this.#inputLoginPin.value);
    });
  }

  addHandlerTransfer(handler) {
    this.#formTransfer.addEventListener('submit', (e) => {
      e.preventDefault();
      handler(this.#inputTransferTo.value, this.#inputTransferAmount.value);
    });
  }

  addHandlerLoan(handler) {
    this.#formLoan.addEventListener('submit', (e) => {
      e.preventDefault();
      handler(this.#inputLoanAmount.value);
    });
  }

  addHandlerClose(handler) {
    this.#formClose.addEventListener('submit', (e) => {
      e.preventDefault();
      handler(this.#inputCloseUsername.value, this.#inputClosePin.value);
    });
  }

  addHandlerSort(handler) {
    this.#btnSort.addEventListener('click', handler);
  }

  renderUI(username) {
    this.#renderWelcomeMessage(username);
    this.#formatCurrentDate(username.locale);
    this.#containerApp.style.opacity = '1';

    this.#clearInput(this.#inputLoginUsername, this.#inputLoginPin);
  }

  #renderWelcomeMessage(username, isLoggedIn = true) {
    // Check if user has logged in
    if (!isLoggedIn)
      return (this.#labelWelcome.textContent = 'Log in to get started');

    username = username.split(' ')[0];

    const hour = new Date().getHours();
    let daytime;

    if (hour <= 12) daytime = 'morning';
    if (hour > 12) daytime = 'afternoon';
    if (hour > 17) daytime = 'evening';

    this.#labelWelcome.textContent = `Good ${daytime}, ${username}!`;
  }

  renderBalance(user) {
    this.#labelBalance.textContent = this.#formatCurrency(
      user.balance,
      user.locale,
      user.currency
    );
  }

  renderMovements(user, sortedMovements) {
    let html = '';
    const movements = sortedMovements ? sortedMovements : user.movements;

    movements.forEach((mov, index) => {
      const movType = mov > 0 ? 'deposit' : 'withdrawal';
      const date = new Date(user.movementsDates[index]);
      const amount = this.#formatCurrency(mov, user.locale, user.currency);

      html += `
        <div class="movements__row">
          <div class="movements__type movements__type--${movType}">${movType}</div>
          <div class="movements__date">${this.#formatMovementDate(
            date,
            user.locale
          )}</div>
          <div class="movements__value">${amount}</div>
        </div>
      `;
    });
    this.#containerMovements.innerHTML = html;
  }

  renderSummary(user) {
    this.#labelSumIn.textContent = `${this.#formatCurrency(
      user.inSum,
      user.locale,
      user.currency
    )}`;
    this.#labelSumOut.textContent = `${this.#formatCurrency(
      user.outSum,
      user.locale,
      user.currency
    )}`;
    this.#labelSumInterest.textContent = `${this.#formatCurrency(
      user.interests,
      user.locale,
      user.currency
    )}`;
  }

  updateUI(user) {
    this.renderBalance(user);
    this.renderUI(user.owner);
    this.renderMovements(user);
    this.renderSummary(user);

    // Clear inputs
    this.#clearInput(
      this.#inputTransferTo,
      this.#inputTransferAmount,
      this.#inputLoanAmount
    );
  }

  #clearInput(...inputs) {
    inputs.forEach((input) => {
      input.value = '';
      input.blur();
    });
  }

  hideUI() {
    // Hide UI
    this.#containerApp.style.opacity = '0';

    // Render new welcome message
    this.#renderWelcomeMessage(null, false);

    // Clear inputs
    this.#clearInput(this.#inputCloseUsername, this.#inputClosePin);
  }

  updateTimer(time) {
    this.#labelTimer.textContent = time;
  }

  #formatCurrentDate(locale) {
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat(locale).format(now);

    this.#labelDate.textContent = `As of ${formattedDate}`;
  }

  #formatMovementDate(date, locale) {
    return new Intl.DateTimeFormat(locale).format(date);
  }

  #formatCurrency(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  }
}

export default new View();
