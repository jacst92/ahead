# Ahead Decision Engine

## Core Purpose

Ahead helps users understand the consequences of financial decisions before they make them.

The Decision Engine is not meant to decide for the user. Its role is to explain likely effects, clarify tradeoffs, and connect a possible action to the user's cash flow, obligations, goals, debt, emergency preparedness, and selected priorities.

## Ahead Status

Ahead uses four plain-language status states:

- `Ahead`: The current plan has meaningful breathing room after known obligations and priority funding.
- `Stable`: The plan is covered, but flexibility is limited or timing matters.
- `Recovering`: The plan is improving after pressure, shortfall, or recent disruption.
- `Behind`: Current obligations or priorities exceed available near-term capacity.

Status should be educational, not judgmental. A status describes the plan's condition, not the user's character.

## Status Inputs

Future versions of the engine will evaluate:

- Cash flow
- Upcoming bills
- Income timing
- Budget categories
- Savings goals
- Debt obligations
- Emergency fund target
- User-selected priorities

Phase One only creates placeholder structures and example outputs. It does not perform real financial calculations.

## Decision Pillars

The Decision Engine organizes consequences through six pillars:

- Cash Flow
- Obligations
- Goals
- Debt
- Emergency Preparedness
- Intentional Progress

Every decision summary should explain the relevant pillars in calm, user-controlled language.

## Decision Summary Shape

A reusable decision summary should be able to display:

- Status impact
- Bills impact
- Goal impact
- Debt impact
- Emergency fund impact
- Tradeoffs
- Educational insight

## Tone Rules

Use TFLC tone:

- Educational
- Calm
- Non-judgmental
- User-controlled

Avoid:

- "You should"
- "You must"
- "The decision is yours"

Use:

- "One path to consider..."
- "This option may fit if..."
- "This would affect..."
- "Choose the path that fits your priorities."

## Placeholder Evaluation Strategy

Current placeholder utilities return deterministic example summaries for prototype scenarios. They are intentionally simple and designed to be replaced by real engines later.

The future engine should:

1. Normalize decision inputs.
2. Evaluate each decision pillar.
3. Determine a status impact.
4. Generate educational tradeoff language.
5. Return a summary object for UI rendering.

## Future Integration Points

The Decision Engine foundation should eventually connect to:

- Budget category plans
- Goal forecasting
- Debt strategy comparisons
- Variable bill learning
- Emergency fund planning
- Timeline forecasting
- What If scenario modeling

The UI should depend on decision summary objects, not direct calculations embedded in screens.
