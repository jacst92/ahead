# Functional Local Budget

Ahead now includes a first functional offline budgeting layer powered by local demo data and user-entered data saved in `localStorage`.

## Implemented Functionality

### Accounts

- Create, edit, and delete accounts.
- Track account name, type, and balance.
- Dashboard uses positive cash balances when calculating available cushion.
- Negative account balances are treated as debt-like balances in baseline summaries.

### Income / Paydays

- Create, edit, and delete income records.
- Track amount, pay date, confidence status, recurring flag, schedule, and custom schedule notes.
- Supported schedule labels include weekly, biweekly, semimonthly, monthly, custom, and one-time.
- Dashboard and Income screens summarize total, recurring, confirmed, and custom-schedule income.

### Bills

- Create, edit, and delete bills.
- Track fixed, variable, and estimated bills.
- Track planned amount, estimated amount, and actual amount after payment.
- Local calculations use actual amount first, then estimated amount, then planned amount.
- When an actual amount is entered, Ahead stores a local bill-history record with the estimated amount, actual amount, and difference.
- Historical actuals are averaged per bill to provide a suggested future estimate for variable or estimated bills.
- Deleting a bill also removes its local bill-history records.

### Budget Categories

- Create, edit, and delete user-defined budget categories.
- Track category name, type, planned amount, and spent amount.
- Dashboard summarizes remaining budget and category usage.

### Goals

- Create, edit, and delete goals.
- Support savings goals, debt payoff goals, and investment goals.
- Track target, saved amount, and monthly contribution.
- Goal funding is included in the local available-cushion calculation.

### Debt

- Create, edit, and delete debt records.
- Track balance, interest rate, minimum payment, extra payment, and payoff strategy placeholder.
- Local calculations include minimum plus extra payments.
- Strategy choices are placeholders for future debt payoff comparisons.

### Demo Mode

- Settings includes `Reset to Demo Data`.
- Reset reloads realistic sample accounts, income, bills, categories, goals, debt, and future timeline events.
- Reset only affects local browser storage.

## Local Persistence

All editable budget data is saved in browser `localStorage` under the current Ahead local data key.

Saved MVP collections:

- `accounts`
- `income`
- `bills`
- `billHistory`
- `budgetCategories`
- `goals`
- `debts`
- `futureEvents`
- local preferences such as Developer Mode and theme

No backend, authentication, bank sync, or external API is used.

## Budget Engine

`budget-engine.js` provides local summary calculations for:

- Account cash and negative balances
- Income totals and recurring schedules
- Bill totals using actual, estimated, or planned amounts
- Bill variance and historical average calculations for future estimation
- Budget category planned, spent, and remaining amounts
- Goal progress and monthly funding
- Debt balances, minimums, extra payments, and total payments
- Available cushion
- Net planned cash flow
- Placeholder status: Ahead, Stable, or Behind

These outputs now power Dashboard summaries and are available for Timeline and Decision Engine integration.

## Still Placeholder

- Recurring schedules are captured and summarized, but not expanded into a full calendar series yet.
- Debt payoff strategy selection is stored, but payoff comparison math is not implemented yet.
- Investment goals are tracked as goals, not connected to brokerage or performance data.
- Ahead Status remains simple deterministic local logic.
- What If and Timeline still use MVP-level deterministic reasoning.

## Recommended Next Build

The next practical step is expanding recurring income and bills into generated future dated events so the Timeline Engine can forecast multiple months from the functional local budget.
