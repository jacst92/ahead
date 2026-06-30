# Currency Input Verification

This bug fix updates Ahead money inputs to accept valid dollar-and-cent values and display currency with two decimals.

## Fixed Behavior

Currency fields now accept:

- `286`
- `286.00`
- `286.56`
- `0.99`
- `1000.01`

Currency fields now reject:

- negative values unless the field intentionally allows them
- more than two decimal places
- non-numeric values

## Fields Covered

- Accounts balance
- Income amount
- Bills planned amount, estimated amount, and actual amount
- Budget category planned and spent amounts
- Goals target, saved, and monthly contribution
- Debt balance, minimum payment, and extra payment
- What If scenario amount

Accounts balance intentionally allows negative values so credit-style balances can still be entered. Timeline future events also allow negative values because outflow events are represented as negative amounts.

## Verification Notes

Manual check for the reported issue:

1. Open `#goals`.
2. Enter `286.56` in a Goal currency field such as `Monthly contribution`.
3. Submit the form.
4. The value saves successfully and displays as `$286.56`.

Additional checks:

- `286`, `286.00`, `0.99`, and `1000.01` save successfully in Goals, Bills, Income, Budget Categories, Debt, Accounts, and What If.
- `286.567` is rejected.
- `abc` is rejected.
- `-286.56` is rejected in Goals, Bills, Income, Budget Categories, Debt, and What If.
- `-286.56` is accepted for account balances where negative balances are intentional.

## Storage

Currency values continue to be stored as normalized decimal numbers, rounded to two decimal places. A future data migration can move these values to integer cents if Ahead needs stricter accounting precision.
