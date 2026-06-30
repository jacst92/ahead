# Local Data Verification Report

## What Can Be Edited

Ahead now supports local create, edit, and delete actions for:

- Accounts, on Dashboard
- Income / paydays, on Income
- Bills, on Bills
- Budget categories, on Budget
- Goals, on Goals
- Debt, on Debt

## What Saves After Refresh

The following user-edited data persists in `localStorage` after a browser refresh:

- Account names, types, and balances
- Income names, dates, amounts, and statuses
- Bill names, due dates, amounts, and statuses
- Budget category names, types, planned amounts, and spent amounts
- Goal names, targets, saved amounts, and monthly contributions
- Debt names, balances, APRs, and minimum payments
- Developer Mode setting

## Demo Data vs Local Data

Ahead starts with realistic demo data. Once a user creates, edits, or deletes local data, the app marks the source as user-edited local data.

Settings includes a `Reset Demo Data` button that clears user-edited local data and restores the original demo dataset.

## What Is Still Placeholder

The following areas remain placeholder logic:

- Ahead Status calculation
- Cash runway forecasting
- Goal forecasting
- Debt payoff strategy comparisons
- What If decision logic
- Timeline projections
- Recommendations and insights

The What If screen now uses the current local data as a baseline, but the scenario impacts are still deterministic placeholder rules.

## What Should Be Built Next

Recommended next steps:

1. Replace placeholder Ahead Status with a real status engine.
2. Add real timeline calculations from income, bills, and account balances.
3. Add category-level budget math and month-cycle tracking.
4. Add real goal forecasting.
5. Add debt payoff comparison logic.
6. Add import/export for local data before any backend is introduced.
