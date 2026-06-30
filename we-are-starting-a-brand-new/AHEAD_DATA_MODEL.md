# Ahead Data Model Specification

This document defines the data structures needed to make Ahead functional with user-entered data while preserving the product philosophy: budgeting creates the data, planning gives it purpose, forecasting shows where it leads, and decision support explains tradeoffs before the user acts.

## MVP Storage Guidance

For the current MVP, the following data should be saved in `localStorage`:

- Accounts
- Income / Paydays
- Bills
- Budget Categories
- Goals
- Debt
- What If Scenarios
- User preferences such as Developer Mode

Transactions, Timeline Events, and Decision Summaries may be generated from local data during the MVP, but can also be cached in `localStorage` if needed for review history. They should eventually be derived from real financial data and engine outputs.

## 1. Accounts

Accounts represent cash, savings, credit, and other balances used to understand available cushion and financial position.

Required fields:

- `id`
- `name`
- `type`
- `balance`
- `currency`

Optional fields:

- `institution`
- `lastUpdated`
- `isIncludedInStatus`
- `notes`

Example object:

```json
{
  "id": "acct_checking",
  "name": "Everyday Checking",
  "type": "checking",
  "balance": 4820,
  "currency": "USD",
  "institution": "Local Bank",
  "isIncludedInStatus": true
}
```

Connection to Ahead Status:

Accounts define available cash, emergency reserves, and debt-like negative balances. They are core inputs for determining whether the user is Ahead, Stable, Recovering, or Behind.

Connection to What If:

What If scenarios compare proposed decisions against current account cushion and reserve levels.

User-editable fields:

- Name
- Type
- Balance
- Institution
- Included in status
- Notes

## 2. Income / Paydays

Income records represent expected cash inflows and timing confidence.

Required fields:

- `id`
- `name`
- `amount`
- `date`
- `status`

Optional fields:

- `frequency`
- `source`
- `confidence`
- `notes`

Example object:

```json
{
  "id": "income_payroll",
  "name": "Payroll",
  "amount": 3420,
  "date": "2026-07-03",
  "status": "confirmed",
  "frequency": "biweekly",
  "confidence": "high"
}
```

Connection to Ahead Status:

Income timing determines whether upcoming obligations are covered before they come due.

Connection to What If:

What If scenarios can evaluate whether a decision fits better today, after the next paycheck, or after a custom income date.

User-editable fields:

- Name
- Amount
- Date
- Status
- Frequency
- Source
- Notes

## 3. Bills

Bills represent required obligations and recurring expenses.

Required fields:

- `id`
- `name`
- `amount`
- `dueDate`
- `status`

Optional fields:

- `categoryId`
- `frequency`
- `isAutopay`
- `isVariable`
- `estimatedRange`
- `notes`

Example object:

```json
{
  "id": "bill_rent",
  "name": "Rent",
  "amount": 1950,
  "dueDate": "2026-07-01",
  "status": "scheduled",
  "frequency": "monthly",
  "isAutopay": true,
  "isVariable": false
}
```

Connection to Ahead Status:

Bills define the minimum obligation load that must be covered before discretionary decisions are considered.

Connection to What If:

What If scenarios compare proposed decisions against upcoming bills and timing risk.

User-editable fields:

- Name
- Amount
- Due date
- Status
- Frequency
- Autopay
- Variable bill flag
- Notes

## 4. Budget Categories

Budget categories define planned spending, actual spending, and the purpose assigned to money.

Required fields:

- `id`
- `name`
- `planned`
- `spent`
- `type`

Optional fields:

- `period`
- `rollover`
- `priority`
- `notes`

Example object:

```json
{
  "id": "cat_food",
  "name": "Food",
  "planned": 760,
  "spent": 540,
  "type": "need",
  "period": "monthly",
  "priority": "normal"
}
```

Connection to Ahead Status:

Categories show whether day-to-day spending is supporting or crowding out the plan.

Connection to What If:

Scenarios can target a category and show whether the decision would increase category pressure or preserve flexibility.

User-editable fields:

- Name
- Planned amount
- Spent amount
- Type
- Period
- Rollover
- Priority
- Notes

## 5. Goals

Goals represent savings targets and intentional progress.

Required fields:

- `id`
- `name`
- `target`
- `saved`
- `priority`

Optional fields:

- `targetDate`
- `monthlyContribution`
- `categoryId`
- `notes`

Example object:

```json
{
  "id": "goal_emergency",
  "name": "Emergency Fund",
  "target": 12000,
  "saved": 8400,
  "priority": "high",
  "targetDate": "2026-12-31",
  "monthlyContribution": 450
}
```

Connection to Ahead Status:

Goals indicate whether the user is making intentional forward progress beyond covering obligations.

Connection to What If:

Scenarios can show whether a decision accelerates, delays, or does not affect goal progress.

User-editable fields:

- Name
- Target
- Saved
- Priority
- Target date
- Monthly contribution
- Notes

## 6. Debt

Debt records represent balances, rates, and required payments.

Required fields:

- `id`
- `name`
- `balance`
- `minimumPayment`
- `interestRate`

Optional fields:

- `type`
- `dueDate`
- `strategy`
- `notes`

Example object:

```json
{
  "id": "debt_card",
  "name": "Credit Card",
  "balance": 2140,
  "minimumPayment": 240,
  "interestRate": 18.4,
  "type": "credit_card",
  "strategy": "avalanche"
}
```

Connection to Ahead Status:

Debt affects required monthly obligations, risk, and flexibility.

Connection to What If:

Extra debt payment scenarios can explain interest tradeoffs, payoff progress, and cash cushion impact.

User-editable fields:

- Name
- Balance
- Minimum payment
- Interest rate
- Type
- Due date
- Strategy
- Notes

## 7. Transactions

Transactions represent money movement. In the MVP, these may be manually entered or deferred until import/sync exists.

Required fields:

- `id`
- `date`
- `amount`
- `description`
- `accountId`

Optional fields:

- `categoryId`
- `merchant`
- `type`
- `isRecurring`
- `notes`

Example object:

```json
{
  "id": "txn_grocery_001",
  "date": "2026-06-24",
  "amount": -86,
  "description": "Grocery Store",
  "accountId": "acct_checking",
  "categoryId": "cat_food",
  "type": "expense"
}
```

Connection to Ahead Status:

Transactions update account balances, category spending, and trend signals.

Connection to What If:

Past transactions help compare a proposed decision to normal spending behavior.

User-editable fields:

- Date
- Amount
- Description
- Account
- Category
- Notes

MVP storage:

Optional for MVP. Recommended once manual transaction entry is introduced.

## 8. What If Scenarios

What If scenarios represent user-entered possible decisions.

Required fields:

- `id`
- `name`
- `type`
- `amount`
- `timing`

Optional fields:

- `targetId`
- `targetType`
- `customDate`
- `priority`
- `notes`

Example object:

```json
{
  "id": "scenario_emergency_transfer",
  "name": "Emergency fund transfer",
  "type": "savings_contribution",
  "amount": 450,
  "timing": "next_paycheck",
  "targetId": "goal_emergency",
  "targetType": "goal",
  "priority": "confidence"
}
```

Connection to Ahead Status:

Scenarios simulate whether a possible action moves the user toward Ahead, keeps them Stable, supports Recovery, or increases Behind risk.

Connection to What If:

This is the primary What If input object.

User-editable fields:

- Name
- Type
- Amount
- Timing
- Target
- Priority
- Notes

## 9. Timeline Events

Timeline events represent upcoming financial moments and projected changes.

Required fields:

- `id`
- `date`
- `title`
- `type`
- `amount`

Optional fields:

- `sourceId`
- `sourceType`
- `statusImpact`
- `description`
- `confidence`

Example object:

```json
{
  "id": "timeline_rent",
  "date": "2026-07-01",
  "title": "Rent clears",
  "type": "bill",
  "amount": -1950,
  "sourceId": "bill_rent",
  "sourceType": "bill",
  "statusImpact": "stable",
  "confidence": "high"
}
```

Connection to Ahead Status:

Timeline events show when status may change based on bills, income, goals, and debt payments.

Connection to What If:

Scenarios can add projected timeline events so users see when consequences happen.

User-editable fields:

- Title
- Date
- Amount
- Type
- Description

MVP storage:

Timeline events can be generated from income, bills, goals, and scenarios. Manual timeline edits are optional.

## 10. Decision Summaries

Decision summaries are generated explanations of scenario consequences.

Required fields:

- `id`
- `scenarioId`
- `statusImpact`
- `billsImpact`
- `goalImpact`
- `debtImpact`
- `emergencyFundImpact`
- `tradeoffs`
- `educationalInsight`

Optional fields:

- `debug`
- `createdAt`
- `baselineSnapshot`
- `confidence`

Example object:

```json
{
  "id": "summary_emergency_transfer",
  "scenarioId": "scenario_emergency_transfer",
  "statusImpact": {
    "value": "Stable",
    "detail": "The plan remains stable while short-term cushion narrows."
  },
  "billsImpact": {
    "value": "Covered",
    "detail": "Upcoming bills remain covered if the transfer happens after payroll."
  },
  "goalImpact": {
    "value": "Improves",
    "detail": "Emergency savings moves closer to the target."
  },
  "debtImpact": {
    "value": "No change",
    "detail": "Debt payments remain on the current path."
  },
  "emergencyFundImpact": {
    "value": "Stronger",
    "detail": "Preparedness improves after the transfer."
  },
  "tradeoffs": [
    "This would reduce short-term cash cushion.",
    "This option may fit if confidence is the priority this cycle."
  ],
  "educationalInsight": "A decision can improve readiness while still changing timing flexibility."
}
```

Connection to Ahead Status:

Decision summaries explain how a scenario affects status and why.

Connection to What If:

This is the primary output displayed on the What If screen.

User-editable fields:

Decision summaries should generally not be manually edited. Users may save, rename, archive, or delete summaries once scenario history exists.

MVP storage:

Generated summaries may remain ephemeral. Save to `localStorage` only if scenario history is introduced.
