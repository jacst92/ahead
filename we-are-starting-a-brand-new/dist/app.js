const philosophy = {
  mission: "Help people make confident financial decisions through intentional progress.",
  promise: "Know what you need to get ahead and stay ahead.",
};

const screens = [
  { id: "dashboard", label: "Dashboard", icon: "A", purpose: "Where do I stand today?" },
  { id: "budget", label: "Budget", icon: "$", purpose: "Where is my money going?" },
  { id: "income", label: "Income", icon: "+", purpose: "When is money coming in?" },
  { id: "bills", label: "Bills", icon: "B", purpose: "What obligations are coming next?" },
  { id: "goals", label: "Goals", icon: "G", purpose: "How am I progressing?" },
  { id: "debt", label: "Debt", icon: "-", purpose: "What are my payoff options?" },
  { id: "timeline", label: "Timeline", icon: ">", purpose: "What happens next?" },
  { id: "whatif", label: "What If?", icon: "?", purpose: "What happens if I make this decision?" },
  { id: "insights", label: "Insights", icon: "i", purpose: "What should I know?" },
  { id: "settings", label: "Settings", icon: "S", purpose: "How do I tailor Ahead to my financial preferences?" },
];

const screenBriefs = {
  dashboard: {
    answer: "You are ahead by 21 days.",
    why: "Your upcoming obligations are funded, your next income is reliable, and your plan still has room for a goal transfer.",
    know: "Rent is the next pressure point.",
    next: "Wait for payroll, then move $450.00 to emergency savings.",
  },
  budget: {
    answer: "Your money is mostly going where you intended.",
    why: "Needs remain stable, future funding is protected, and lifestyle spending is the only category asking for attention.",
    know: "Food and dining are moving faster than the rest of the plan.",
    next: "Keep discretionary spending under $84.00 per day until rent clears.",
  },
  income: {
    answer: "Your next reliable income arrives before the largest bill.",
    why: "Payroll is confirmed for Jun 28 and covers the upcoming rent cycle without relying on projected income.",
    know: "Freelance income should be treated as upside until it posts.",
    next: "Base this week's decisions on confirmed payroll only.",
  },
  bills: {
    answer: "Upcoming obligations are covered.",
    why: "The largest bills are scheduled and fit inside the current runway, but utilities may vary.",
    know: "Rent clears first; variable utilities follow three days later.",
    next: "Hold optional transfers until rent and utilities are both posted.",
  },
  goals: {
    answer: "Your goals are progressing, led by emergency savings.",
    why: "Current savings rhythm keeps all visible goals moving without pulling cash away from obligations.",
    know: "Emergency savings has the strongest near-term impact on confidence.",
    next: "Fund emergency savings after payroll if the bill schedule stays unchanged.",
  },
  debt: {
    answer: "Minimums are covered; extra payoff is a choice, not a pressure.",
    why: "Debt payments fit the current plan, while the credit card is the highest-interest tradeoff.",
    know: "Interest savings and cash flexibility point to different choices.",
    next: "Compare one extra payment against preserving an 18-day runway.",
  },
  timeline: {
    answer: "The next two weeks are stable with one watch point.",
    why: "Payroll extends runway before rent reduces it, keeping the plan funded through the next cycle.",
    know: "Jul 01 is the biggest cash movement in the timeline.",
    next: "Review decisions after rent posts, not before.",
  },
  whatif: {
    answer: "A $450.00 transfer improves readiness but shortens runway.",
    why: "Emergency savings improve immediately, while post-rent coverage moves from 21 days to 18 days.",
    know: "This is a timing decision, not an affordability warning.",
    next: "Make the transfer only after confirmed payroll posts.",
  },
  insights: {
    answer: "Your plan is working, with one spending pattern to watch.",
    why: "Fixed costs are contained and goal funding is active, but dining pace could crowd out flexibility.",
    know: "The strongest signal is stability, not restriction.",
    next: "Protect the plan by watching discretionary pace for the next 10 days.",
  },
  settings: {
    answer: "Ahead should adapt to your planning style.",
    why: "Preferences control timing, tone, and notification pressure so guidance stays helpful instead of noisy.",
    know: "The best settings are the ones that reduce decision friction.",
    next: "Use neutral guidance and a 21-day runway while the plan is still forming.",
  },
};

const sample = {
  status: {
    cash: 8420,
    aheadDays: 21,
    planned: 76,
    nextDecision: "Move $450.00 toward the emergency fund after rent clears.",
  },
  metrics: [
    ["Available to plan", "$2,840.00", "After upcoming bills and planned transfers"],
    ["Monthly progress", "76%", "Spending is tracking below plan by $318.00"],
    ["Next obligation", "$1,950.00", "Rent due in 5 days"],
    ["Confidence range", "High", "Income timing and bill schedule are stable"],
  ],
  budget: [
    ["Home", 1950, 38],
    ["Food", 760, 20],
    ["Transportation", 430, 13],
    ["Lifestyle", 520, 15],
    ["Future", 900, 14],
  ],
  income: [
    ["Payroll", "Jun 28", "$3,420.00", "Confirmed"],
    ["Freelance retainer", "Jul 03", "$1,200.00", "Expected"],
    ["Interest", "Jul 05", "$18.00", "Projected"],
  ],
  bills: [
    ["Rent", "Jul 01", "$1,950.00", "Scheduled"],
    ["Utilities", "Jul 04", "$164.00", "Variable"],
    ["Student loan", "Jul 08", "$385.00", "Autopay"],
    ["Insurance", "Jul 12", "$142.00", "Scheduled"],
  ],
  goals: [
    ["Emergency fund", "$8,400.00 saved of $12,000.00", 70],
    ["Holiday travel", "$1,150.00 saved of $2,000.00", 58],
    ["Home reserve", "$4,600.00 saved of $7,500.00", 61],
  ],
  debts: [
    ["Student loan", "$18,240.00", "5.8%", "$385.00"],
    ["Auto loan", "$9,800.00", "4.2%", "$410.00"],
    ["Credit card", "$2,140.00", "18.4%", "$240.00"],
  ],
  timeline: [
    ["Today", "Plan review", "Discretionary spending can stay under $84.00 per day.", "Stable"],
    ["Jun 28", "Payroll posts", "Cash runway extends from 21 to 39 days.", "Positive"],
    ["Jul 01", "Rent clears", "Runway normalizes to 24 days after the largest fixed bill.", "Watch"],
    ["Jul 08", "Debt payment", "Minimums stay covered without pulling from savings.", "Stable"],
  ],
  insights: [
    ["Good signal", "Fixed bills use 49% of take-home income, leaving room for goals and variable spending."],
    ["Tradeoff", "A $450.00 emergency fund transfer still leaves 18 days covered after rent."],
    ["Watch", "Dining has used 71% of its plan with 10 days left in the cycle."],
  ],
};

const futureDecisionLayers = {
  statusEngine: "Status reasoning",
  decisionEngine: "Tradeoff comparison",
  timelineEngine: "Forward projection",
  recommendationEngine: "Next-action ranking",
};

const qs = (selector) => document.querySelector(selector);
const money = (value) => numberValue(value).toLocaleString("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const developerModeKey = "ahead-developer-mode";
let liveScenarioSummary = null;
let inlineEditState = { collection: null, id: null };
let whatIfFormState = {
  name: "Emergency fund transfer",
  type: "savingsContribution",
  amount: 450,
  target: "Emergency fund",
  timing: "nextPaycheck",
  customDate: "",
};

const sampleWhatIfScenarios = [
  {
    label: "$450.00 savings transfer",
    name: "Emergency fund transfer",
    type: "savingsContribution",
    amount: 450,
    target: "Emergency fund",
    timing: "nextPaycheck",
    customDate: "",
  },
  {
    label: "$800.00 purchase",
    name: "Replace laptop",
    type: "purchase",
    amount: 800,
    target: "Technology category",
    timing: "today",
    customDate: "",
  },
  {
    label: "$500.00 extra debt payment",
    name: "Extra credit card payment",
    type: "debtPayment",
    amount: 500,
    target: "Credit card",
    timing: "nextPaycheck",
    customDate: "",
  },
  {
    label: "$700.00 overtime income",
    name: "Overtime income",
    type: "extraIncome",
    amount: 700,
    target: "Emergency fund",
    timing: "custom",
    customDate: "Jul 12",
  },
];

function isDeveloperMode() {
  return localStorage.getItem(developerModeKey) === "on";
}

function setDeveloperMode(enabled) {
  localStorage.setItem(developerModeKey, enabled ? "on" : "off");
}

function appData() {
  return AheadLocalData.load();
}

function baseline() {
  return AheadLocalData.getBaseline(appData());
}

function dataSourceBadge() {
  return baseline().source === "local"
    ? { text: "Local data", tone: "blue" }
    : { text: "Demo data", tone: "gold" };
}

function numberValue(value) {
  return Number(value || 0);
}

function isValidCurrencyInput(value, allowNegative = false) {
  const raw = String(value ?? "").trim();
  if (raw === "") return true;
  const pattern = allowNegative ? /^-?\d+(\.\d{1,2})?$/ : /^\d+(\.\d{1,2})?$/;
  return pattern.test(raw);
}

function normalizeCurrencyValue(value) {
  const numeric = Number(String(value ?? "0").trim() || 0);
  return Number(numeric.toFixed(2));
}

function pct(part, whole) {
  if (!whole) return 0;
  return Math.max(0, Math.min(100, Math.round((Number(part || 0) / Number(whole || 0)) * 100)));
}

const editorConfigs = {
  accounts: {
    title: "Accounts",
    subtitle: "Local demo balances used by the dashboard and What If baseline.",
    collection: "accounts",
    fields: [
      { key: "name", label: "Account name", type: "text" },
      { key: "type", label: "Type", type: "select", options: ["Checking", "Savings", "Credit", "Investment", "Cash"] },
      { key: "balance", label: "Balance", type: "number", currency: true, allowNegative: true },
    ],
    row: (item) => [item.name, item.type, money(numberValue(item.balance)), ""],
  },
  income: {
    title: "Income / paydays",
    subtitle: "Recurring and custom payday schedules used for local planning context.",
    collection: "income",
    fields: [
      { key: "name", label: "Income name", type: "text" },
      { key: "date", label: "Pay date", type: "text" },
      { key: "amount", label: "Amount", type: "number", currency: true },
      { key: "status", label: "Status", type: "select", options: ["Confirmed", "Expected", "Projected"] },
      { key: "recurring", label: "Recurring", type: "select", options: ["Yes", "No"] },
      { key: "schedule", label: "Schedule", type: "select", options: ["Weekly", "Biweekly", "Semimonthly", "Monthly", "Custom", "One-time"] },
      { key: "customSchedule", label: "Custom schedule", type: "text" },
    ],
    row: (item) => [item.name, `${item.date} | ${item.schedule || "One-time"}`, money(numberValue(item.amount)), item.recurring === "Yes" ? "Recurring" : item.status],
  },
  bills: {
    title: "Bills",
    subtitle: "Fixed, variable, estimated, and actual obligations used by local planning.",
    collection: "bills",
    fields: [
      { key: "name", label: "Bill name", type: "text" },
      { key: "dueDate", label: "Due date", type: "text" },
      { key: "amount", label: "Planned amount", type: "number", currency: true },
      { key: "estimatedAmount", label: "Estimated amount", type: "number", currency: true },
      { key: "actualAmount", label: "Actual amount after payment", type: "number", currency: true },
      { key: "billType", label: "Bill type", type: "select", options: ["Fixed", "Variable", "Estimated"] },
      { key: "status", label: "Status", type: "select", options: ["Scheduled", "Autopay", "Variable", "Planned", "Paid"] },
    ],
    row: (item) => [item.name, `${item.dueDate} | ${item.billType || item.status}`, money(AheadBudgetEngine.billAmount(item)), billVarianceLabel(item)],
  },
  budgetCategories: {
    title: "Budget categories",
    subtitle: "Editable category plan for local demo budgeting.",
    collection: "budgetCategories",
    fields: [
      { key: "name", label: "Category", type: "text" },
      { key: "type", label: "Type", type: "select", options: ["Need", "Want", "Future"] },
      { key: "planned", label: "Planned", type: "number", currency: true },
      { key: "spent", label: "Spent", type: "number", currency: true },
    ],
    row: (item) => [item.name, `${item.type} | ${pct(item.spent, item.planned)}% used`, money(numberValue(item.planned)), money(numberValue(item.spent))],
  },
  goals: {
    title: "Goals",
    subtitle: "Savings, debt payoff, and investment goals used by progress views.",
    collection: "goals",
    fields: [
      { key: "name", label: "Goal name", type: "text" },
      { key: "goalType", label: "Goal type", type: "select", options: ["Savings", "Debt payoff", "Investment"] },
      { key: "target", label: "Target", type: "number", currency: true },
      { key: "saved", label: "Saved", type: "number", currency: true },
      { key: "monthly", label: "Monthly contribution", type: "number", currency: true },
    ],
    row: (item) => [item.name, `${item.goalType || "Savings"} | ${money(numberValue(item.saved))} of ${money(numberValue(item.target))}`, `${pct(item.saved, item.target)}%`, money(numberValue(item.monthly))],
  },
  debts: {
    title: "Debt",
    subtitle: "Debt obligations, extra payments, and placeholder strategy preferences.",
    collection: "debts",
    fields: [
      { key: "name", label: "Debt name", type: "text" },
      { key: "balance", label: "Balance", type: "number", currency: true },
      { key: "rate", label: "APR", type: "number" },
      { key: "payment", label: "Minimum payment", type: "number", currency: true },
      { key: "extraPayment", label: "Extra payment", type: "number", currency: true },
      { key: "payoffStrategy", label: "Payoff strategy", type: "select", options: ["Avalanche placeholder", "Snowball placeholder", "Balanced placeholder", "Minimums only"] },
    ],
    row: (item) => [item.name, `${numberValue(item.rate)}% APR | ${item.payoffStrategy || "Minimums only"}`, money(numberValue(item.balance)), `${money(AheadBudgetEngine.debtPayment(item))}/mo`],
  },
  futureEvents: {
    title: "Future events",
    subtitle: "User-created timeline items used only for local forward projection.",
    collection: "futureEvents",
    fields: [
      { key: "name", label: "Event name", type: "text" },
      { key: "date", label: "Date", type: "text" },
      { key: "amount", label: "Amount", type: "number", currency: true, allowNegative: true },
      { key: "type", label: "Type", type: "select", options: ["Future event", "Savings transfer", "Bill", "Income", "Debt payment"] },
      { key: "notes", label: "Notes", type: "text" },
    ],
    row: (item) => [item.name, `${item.date} | ${item.type}`, money(numberValue(item.amount)), item.notes],
  },
};

function fieldMarkup(config, item = {}, idSuffix = "new") {
  return config.fields
    .map((field) => {
      const value = item[field.key] ?? "";
      const fieldId = `${config.collection}-${field.key}-${idSuffix}`;
      if (field.type === "select") {
        return `
          <div class="field">
            <label for="${fieldId}">${field.label}</label>
            <select id="${fieldId}" name="${field.key}">
              ${field.options.map((option) => `<option value="${option}" ${String(value) === option ? "selected" : ""}>${option}</option>`).join("")}
            </select>
          </div>
        `;
      }
      return `
        <div class="field">
          <label for="${fieldId}">${field.label}</label>
          <input
            id="${fieldId}"
            name="${field.key}"
            type="${field.type}"
            value="${value}"
            ${field.type === "number" ? `step="${field.currency ? "0.01" : "any"}"` : ""}
            ${field.type === "number" && !field.allowNegative ? `min="0"` : ""}
            ${field.currency ? 'inputmode="decimal"' : ""}
            ${field.currency ? 'data-currency-field="true"' : ""}
            ${field.allowNegative ? 'data-allow-negative="true"' : ""}
          />
        </div>
      `;
    })
    .join("");
}

function editableSection(configKey) {
  const config = editorConfigs[configKey];
  const data = appData();
  const items = data[config.collection] || [];

  return card(config.title, config.subtitle, `
    <form class="data-form" data-collection="${config.collection}">
      <input type="hidden" name="id" value="" />
      <div class="form-grid">${fieldMarkup(config)}</div>
      <div class="button-row" style="margin-top:16px">
        <button class="primary-button" type="submit">Add ${config.title}</button>
      </div>
    </form>
    <div class="editable-list">
      ${items.map((item) => editableRow(config, item)).join("")}
    </div>
  `, dataSourceBadge());
}

function editableRow(config, item) {
  const [title, meta, amount, extra] = config.row(item);
  const isEditing = inlineEditState.collection === config.collection && inlineEditState.id === item.id;
  if (isEditing) {
    return `
      <div class="editable-row editable-row-editing">
        <form class="data-form inline-edit-form" data-collection="${config.collection}">
          <input type="hidden" name="id" value="${item.id}" />
          <div class="inline-edit-heading">
            <div>
              <strong>Edit ${title}</strong>
              <div class="muted">Changes save locally and this item stays in place.</div>
            </div>
          </div>
          <div class="form-grid">${fieldMarkup(config, item, item.id)}</div>
          <div class="button-row inline-edit-actions">
            <button class="primary-button" type="submit">Save</button>
            <button class="ghost-button" type="button" data-cancel-inline-edit="true">Cancel</button>
          </div>
        </form>
      </div>
    `;
  }
  return `
    <div class="editable-row">
      <div>
        <strong>${title}</strong>
        <div class="muted">${meta}</div>
      </div>
      <div class="editable-row-value">
        <span class="amount">${amount}</span>
        ${extra ? `<span class="muted">${extra}</span>` : ""}
      </div>
      <div class="mini-actions">
        <button class="ghost-button" type="button" data-edit-collection="${config.collection}" data-edit-id="${item.id}">Edit</button>
        <button class="ghost-button danger-button" type="button" data-delete-collection="${config.collection}" data-delete-id="${item.id}">Delete</button>
      </div>
    </div>
  `;
}

function navMarkup(item) {
  return `
    <a class="nav-item" href="#${item.id}" data-nav="${item.id}">
      <span class="nav-icon" aria-hidden="true">${item.icon}</span>
      <span>${item.label}</span>
    </a>
  `;
}

function card(title, subtitle, body, badge = "") {
  return `
    <article class="card">
      <div class="card-header">
        <div>
          <h2>${title}</h2>
          ${subtitle ? `<p class="muted">${subtitle}</p>` : ""}
        </div>
        ${badge ? `<span class="badge ${badge.tone || ""}">${badge.text}</span>` : ""}
      </div>
      ${body}
    </article>
  `;
}

function metricCards() {
  const current = baseline();
  const snapshot = current.budgetSnapshot || AheadBudgetEngine.buildSnapshot(appData());
  const metrics = [
    ["Available cushion", money(snapshot.availableCushion), `${current.source === "local" ? "User-edited local data" : "Demo data"} after obligations and planned funding`],
    ["Budget remaining", money(snapshot.categories.remaining), `${snapshot.categories.usedPercent}% of editable categories used`],
    ["Goal progress", `${snapshot.goals.progress}%`, `${snapshot.goals.count} goals across savings, debt payoff, and investing`],
    ["Debt payments", money(snapshot.debt.totalPayments), `${money(snapshot.debt.extraPayments)} in extra payments tracked`],
  ];
  return metrics
    .map(
      ([label, value, note]) => `
      <article class="metric-card">
        <span class="metric-label">${label}</span>
        <strong class="metric-value">${value}</strong>
        <p class="muted">${note}</p>
      </article>
    `,
    )
    .join("");
}

function answerPanel(id) {
  const brief = id === "timeline" ? timelineBrief() : screenBriefs[id];
  if (!brief || id === "dashboard") return "";
  return `
    <section class="answer-panel">
      <div class="answer-copy">
        <span class="eyebrow">Answer first</span>
        <h2>${brief.answer}</h2>
        <p>${brief.why}</p>
      </div>
      <div class="clarity-stack">
        <div class="clarity-item"><span>What to know</span><strong>${brief.know}</strong></div>
        <div class="clarity-item"><span>Next decision</span><strong>${brief.next}</strong></div>
      </div>
    </section>
  `;
}

function timelineBrief() {
  const projection = AheadTimelineEngine.buildProjection(appData());
  if (projection.firstDeficit) {
    return {
      answer: "A future balance needs attention.",
      why: projection.status.detail,
      know: `${projection.firstDeficit.title} is the first projected pressure point.`,
      next: "Compare timing, income, and optional transfers before that date.",
    };
  }

  return {
    answer: "Your visible timeline remains funded.",
    why: projection.status.detail,
    know: `The projection ends at ${money(projection.projectedBalance)} using local data.`,
    next: "Review any planned transfers against the next major obligation.",
  };
}

function progressList(items) {
  return `
    <div class="stack">
      ${items
        .map(
          ([label, meta, pct]) => `
        <div>
          <div class="list-row">
            <div>
              <strong>${label}</strong>
              <div class="muted">${meta}</div>
            </div>
            <span class="amount">${pct}%</span>
          </div>
          <div class="progress" aria-label="${label} progress"><span style="width: ${pct}%"></span></div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}

function rows(items) {
  return `
    <div class="stack">
      ${items
        .map(([a, b, c, d], index) => {
          const tones = ["green", "blue", "gold", "teal", "violet", "red"];
          return `
            <div class="list-row">
              <div>
                <div class="row-title">
                  <span class="dot ${tones[index % tones.length]}"></span>
                  <strong>${a}</strong>
                </div>
                <div class="muted">${b}</div>
              </div>
              <div>
                <div class="amount">${c}</div>
                ${d ? `<div class="muted">${d}</div>` : ""}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function bars(values, secondary = false) {
  return `
    <div class="bars" aria-label="Monthly trend chart">
      ${values.map((value) => `<span class="bar ${secondary ? "secondary" : ""}" style="height:${value}%"></span>`).join("")}
    </div>
  `;
}

function timelineCard(event) {
  const tone = event.status === "Deficit" ? "danger" : event.status === "Watch" ? "gold" : event.status === "Improves" ? "blue" : "";
  const amountClass = event.amount > 0 ? "positive" : event.amount < 0 ? "negative" : "";
  return `
    <div class="timeline-card ${event.status === "Deficit" ? "is-deficit" : ""}">
      <span class="timeline-date">${event.dateLabel}</span>
      <div class="timeline-main">
        <div class="timeline-card-title">
          <strong>${event.title}</strong>
          <span class="muted">${event.type}</span>
        </div>
        <div class="muted">${event.detail}</div>
      </div>
      <div class="timeline-amounts">
        <span class="amount ${amountClass}">${event.amount === 0 ? "Starting point" : money(event.amount)}</span>
        <span class="muted">Balance ${money(event.runningBalance)}</span>
      </div>
      <span class="badge ${tone}">${event.status}</span>
    </div>
  `;
}

function timelineDeficitNotice(projection) {
  if (!projection.firstDeficit) return "";
  const event = projection.firstDeficit;
  return `
    <div class="notice warning">
      <strong>Projected deficit watch</strong>
      <p>${event.title} on ${event.dateLabel} would move the projected checking balance to ${money(event.runningBalance)}. The pressure comes from the timing of this event relative to the income and obligations already in the local timeline.</p>
    </div>
  `;
}

function billVarianceLabel(bill) {
  const variance = AheadBudgetEngine.billVariance(bill);
  if (!variance) return numberValue(bill.actualAmount) > 0 ? "On estimate" : "No actual yet";
  return variance > 0 ? `${money(variance)} over estimate` : `${money(Math.abs(variance))} under estimate`;
}

function decisionImpactTile(item) {
  return `
    <div class="decision-impact">
      <span class="badge ${item.tone || ""}">${item.label}</span>
      <strong>${item.value}</strong>
      <p class="muted">${item.detail}</p>
    </div>
  `;
}

function decisionSummary(summary) {
  const impacts = [
    summary.statusImpact,
    summary.billsImpact,
    summary.goalImpact,
    summary.debtImpact,
    summary.emergencyFundImpact,
  ];

  return `
    <article class="card decision-summary">
      <div class="card-header">
        <div>
          <h2>Decision summary</h2>
          <p class="muted">${summary.title}</p>
        </div>
        <span class="badge ${summary.isLive ? "" : "blue"}">${summary.isLive ? "Live scenario" : "Example data"}</span>
      </div>
      <div class="decision-impact-grid">
        ${impacts.map(decisionImpactTile).join("")}
      </div>
      <div class="decision-learning">
        <div>
          <span class="eyebrow">Tradeoffs</span>
          <ul>
            ${summary.tradeoffs.map((tradeoff) => `<li>${tradeoff}</li>`).join("")}
          </ul>
        </div>
        <div class="clarity-item">
          <span>Educational insight</span>
          <strong>${summary.educationalInsight}</strong>
        </div>
      </div>
    </article>
  `;
}

function decisionPillarsEvaluated() {
  const foundation = AheadDecisionEngine.getDecisionFoundation();
  return card("Decision Pillars Evaluated", "The placeholder engine checks each scenario against the same decision framework.", `
    <div class="pillar-grid">
      ${foundation.pillars
        .map(
          (pillar) => `
        <div class="pillar-tile">
          <span class="eyebrow">${pillar}</span>
          <strong>${pillar === "Emergency Preparedness" ? "Readiness buffer" : "Included in review"}</strong>
        </div>
      `,
        )
        .join("")}
    </div>
  `, { text: "Engine view", tone: "blue" });
}

function decisionDebugCards(summary) {
  if (!isDeveloperMode()) return "";
  const debug = summary.debug;
  return `
    <article class="card debug-card">
      <div class="card-header">
        <div>
          <h2>Developer reasoning</h2>
          <p class="muted">${summary.title}</p>
        </div>
        <span class="badge gold">Developer Mode</span>
      </div>
      <div class="debug-grid">
        <div class="clarity-item">
          <span>Placeholder inputs evaluated</span>
          <strong>${debug.placeholderInputs.join(" | ")}</strong>
        </div>
        <div class="clarity-item">
          <span>Pillars triggered</span>
          <strong>${debug.pillarsTriggered.join(", ")}</strong>
        </div>
        <div class="clarity-item">
          <span>Status reason</span>
          <strong>${debug.statusReason}</strong>
        </div>
        <div class="clarity-item">
          <span>Future replacement</span>
          <strong>${debug.futureReplacement}</strong>
        </div>
      </div>
    </article>
  `;
}

function scenarioOverview(summaries) {
  return `
    <section class="grid two">
      ${summaries
        .map(
          (summary) => `
        <article class="card scenario-card">
          <span class="eyebrow">What If example</span>
          <h2>${summary.title}</h2>
          <p class="muted">${summary.statusImpact.detail}</p>
          <div class="button-row">
            <span class="badge ${summary.statusImpact.tone}">${summary.statusImpact.value}</span>
            <span class="badge ${summary.goalImpact.tone}">${summary.goalImpact.label}: ${summary.goalImpact.value}</span>
          </div>
        </article>
      `,
        )
        .join("")}
    </section>
  `;
}

function whatIfScenarioForm() {
  return card("Live scenario builder", "Enter a decision and Ahead will generate a placeholder Decision Summary from your inputs.", `
    <form id="whatIfForm" class="scenario-form">
      <div class="form-grid">
        <div class="field"><label for="scenarioName">Scenario name</label><input id="scenarioName" name="name" value="${whatIfFormState.name}" /></div>
        <div class="field">
          <label for="scenarioType">Scenario type</label>
          <select id="scenarioType" name="type">
            ${[
              ["purchase", "Purchase"],
              ["debtPayment", "Extra Debt Payment"],
              ["savingsContribution", "Savings Contribution"],
              ["extraIncome", "Extra Income"],
              ["skippedExpense", "Skipped Expense"],
            ].map(([value, label]) => `<option value="${value}" ${whatIfFormState.type === value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label for="scenarioAmount">Amount</label><input id="scenarioAmount" name="amount" type="number" step="0.01" min="0" inputmode="decimal" data-currency-field="true" value="${whatIfFormState.amount}" /></div>
        <div class="field"><label for="scenarioTarget">Target goal or category</label><input id="scenarioTarget" name="target" value="${whatIfFormState.target}" /></div>
        <div class="field">
          <label for="scenarioTiming">Timing</label>
          <select id="scenarioTiming" name="timing">
            ${[
              ["today", "Today"],
              ["nextPaycheck", "Next paycheck"],
              ["custom", "Custom date"],
            ].map(([value, label]) => `<option value="${value}" ${whatIfFormState.timing === value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label for="scenarioCustomDate">Custom date</label><input id="scenarioCustomDate" name="customDate" value="${whatIfFormState.customDate}" placeholder="Jul 12" /></div>
      </div>
      <div class="button-row" style="margin-top:16px">
        <button class="primary-button" type="submit">Generate Decision Summary</button>
      </div>
    </form>
  `, { text: "Interactive" });
}

function sampleScenarioButtons() {
  return card("Sample scenarios", "Tap a realistic example to populate the live scenario builder.", `
    <div class="sample-scenarios">
      ${sampleWhatIfScenarios.map((scenario, index) => `
        <button class="choice-button sample-scenario" type="button" data-sample-index="${index}">
          ${scenario.label}
        </button>
      `).join("")}
    </div>
  `, { text: "Quick test", tone: "blue" });
}

function decisionStrip() {
  const current = baseline();
  const snapshot = current.budgetSnapshot || AheadBudgetEngine.buildSnapshot(appData());
  const brief = {
    answer: snapshot.status === "Behind" ? "A future obligation needs attention." : `You are ${snapshot.status.toLowerCase()} by ${snapshot.aheadDays} days.`,
    why: `${money(snapshot.accounts.positiveCash)} in positive cash is measured against ${money(snapshot.bills.total)} in bills, ${money(snapshot.debt.totalPayments)} in debt payments, and ${money(snapshot.goals.monthly)} in planned goal funding.`,
    know: `Planned cash flow is ${money(snapshot.netPlannedCashFlow)} before variable spending changes.`,
    next: snapshot.availableCushion < 0 ? "Review bill timing, income timing, or optional transfers." : "Keep the next optional transfer aligned with upcoming obligations.",
  };
  return `
    <section class="decision-strip">
      <div class="decision-tile"><span>Am I ahead?</span><strong>${brief.answer}</strong></div>
      <div class="decision-tile"><span>Why?</span><strong>${brief.why}</strong></div>
      <div class="decision-tile"><span>Know this</span><strong>${brief.know}</strong></div>
      <div class="decision-tile"><span>Next best decision</span><strong>${brief.next}</strong></div>
    </section>
  `;
}

function dashboard() {
  const current = baseline();
  const snapshot = current.budgetSnapshot || AheadBudgetEngine.buildSnapshot(appData());
  return `
    <section class="hero-card">
      <div class="hero-headline">
        <span class="eyebrow">Ahead status</span>
        <h2>${snapshot.status === "Behind" ? "Your plan needs timing attention." : `You are ${snapshot.status.toLowerCase()} by ${current.aheadDays} days.`}</h2>
        <p>Your offline budget shows ${money(current.availableCushion)} available after bills, goal funding, and debt payments currently tracked in local data.</p>
      </div>
      <div class="hero-metrics">
        <div class="hero-metric"><span>Positive cash</span><strong>${money(current.positiveCash)}</strong></div>
        <div class="hero-metric"><span>Goals funded</span><strong>${current.goalProgress}%</strong></div>
        <div class="hero-metric"><span>Budget status</span><strong>${snapshot.status}</strong></div>
      </div>
    </section>
    ${decisionStrip()}
    <section class="grid four">${metricCards()}</section>
    <section class="grid two">
      ${editableSection("accounts")}
      ${card("What changed", "Recent movement in your plan", rows([
        ["Local data status", current.source === "local" ? "Using user-edited local data" : "Using resettable demo data", current.source === "local" ? "Local" : "Demo"],
        ["Bills", "Fixed, variable, estimated, and actual amounts", money(snapshot.bills.total)],
        ["Bill estimation", `${snapshot.bills.historyCount} actual payments tracked`, `${snapshot.bills.averageVariance >= 0 ? "+" : "-"}${money(Math.abs(snapshot.bills.averageVariance))} avg variance`],
        ["Income", `${snapshot.income.recurringTotal ? "Recurring income is active" : "One-time income only"}`, money(snapshot.income.total)],
        ["Debt payments", "Minimums plus extra payments", money(snapshot.debt.totalPayments)],
      ]), { text: "Context" })}
    </section>
    <section class="grid two">
      ${card("Planning runway", "Forward view based on scheduled cash movement", bars([44, 58, 49, 63, 72, 68, 80, 76, 70, 82, 88, 84]), { text: "21 days", tone: "blue" })}
    </section>
  `;
}

function budget() {
  const data = appData();
  const categoryRows = data.budgetCategories.map((item) => [item.name, `${item.type} | ${pct(item.spent, item.planned)}% used`, money(numberValue(item.planned)), money(numberValue(item.spent))]);
  return `
    <section class="grid two">
      ${card("Spending allocation", "The plan is stable because essentials are contained", `<div class="donut"></div>${rows(categoryRows)}`, { text: "Balanced" })}
      ${editableSection("budgetCategories")}
    </section>
    <section class="grid three">
      ${["Needs", "Wants", "Future"].map((label, index) => card(label, ["Stable fixed costs", "Room for choices", "Protected progress"][index], bars([[78,66,72,64,70,74,68,80,76,69,73,71],[54,48,62,70,58,64,76,52,49,68,61,59],[45,52,58,55,64,69,72,71,76,82,78,85]][index], index === 2), { text: ["49%", "27%", "24%"][index] })).join("")}
    </section>
  `;
}

function income() {
  const data = appData();
  const snapshot = AheadBudgetEngine.buildSnapshot(data);
  return `
    <section class="grid two">
      ${card("Upcoming income", "Timing matters more than totals", rows(data.income.map((item) => [item.name, `${item.date} | ${item.schedule || "One-time"}`, money(numberValue(item.amount)), item.status])), { text: `${data.income.length} events` })}
      ${editableSection("income")}
    </section>
    <section class="grid two">
      ${card("Income rhythm", "Cash-in pattern for planning confidence", bars([62, 68, 54, 72, 78, 64, 84, 70, 76, 81, 69, 88], true), { text: "Reliable", tone: "blue" })}
      ${card("Income confidence", "Ahead separates confirmed, expected, and projected money so planning stays honest.", `
      <div class="grid three">
        <div><span class="metric-label">Confirmed</span><strong class="metric-value">${money(snapshot.income.confirmed)}</strong><p class="muted">Confirmed income</p></div>
        <div><span class="metric-label">Recurring</span><strong class="metric-value">${money(snapshot.income.recurringTotal)}</strong><p class="muted">Recurring schedules</p></div>
        <div><span class="metric-label">Custom</span><strong class="metric-value">${snapshot.income.customSchedules}</strong><p class="muted">Custom payday schedules</p></div>
      </div>
    `, { text: "Planning context" })}
    </section>
  `;
}

function bills() {
  const data = appData();
  const snapshot = AheadBudgetEngine.buildSnapshot(data);
  return `
    <section class="grid two">
      ${card("Next obligations", "Fixed, variable, estimated, and actual bill amounts", rows(data.bills.map((item) => [item.name, `${item.dueDate} | ${item.billType || "Planned"}`, money(AheadBudgetEngine.billAmount(item)), billVarianceLabel(item)])), { text: "Local" })}
      ${editableSection("bills")}
    </section>
    <section class="grid two">
      ${card("Variable pressure", "Bills that deserve a little extra room", `
        <div class="stack">
          ${[
            ["Fixed bills", "Known recurring obligations", pct(snapshot.bills.fixed, snapshot.bills.total)],
            ["Variable bills", "Bills that can move", pct(snapshot.bills.variable, snapshot.bills.total)],
            ["Actual amounts", "Bills with paid amounts entered", pct(snapshot.bills.actual, snapshot.bills.total)],
          ].map(([a,b,p]) => `
            <div>
              <div class="list-row"><div><strong>${a}</strong><div class="muted">${b}</div></div><span class="amount">${p}%</span></div>
              <div class="progress"><span style="width:${p}%"></span></div>
            </div>
          `).join("")}
        </div>
      `, { text: money(snapshot.bills.total), tone: "gold" })}
      ${card("Bill estimation history", "Actual payments help Ahead estimate future variable bills.", `
        <div class="stack">
          ${data.bills.map((bill) => {
            const average = AheadBudgetEngine.billAverage(data, bill);
            const historyCount = AheadBudgetEngine.billHistoryFor(data, bill).length;
            const suggested = AheadBudgetEngine.suggestedBillEstimate(data, bill);
            return `
              <div class="list-row">
                <div>
                  <strong>${bill.name}</strong>
                  <div class="muted">${historyCount ? `${historyCount} actual payment${historyCount === 1 ? "" : "s"} tracked` : "No actual history yet"}</div>
                </div>
                <div class="editable-row-value">
                  <span class="amount">${money(suggested)}</span>
                  <span class="muted">${average ? "Historical average" : "Current estimate"}</span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `, { text: `${snapshot.bills.historyCount} records`, tone: "blue" })}
    </section>
  `;
}

function goals() {
  const data = appData();
  const snapshot = AheadBudgetEngine.buildSnapshot(data);
  return `
    <section class="grid two">
      ${card("Goal progress", "Savings, debt payoff, and investment goals", progressList(data.goals.map((item) => [item.name, `${item.goalType || "Savings"} | ${money(numberValue(item.saved))} saved of ${money(numberValue(item.target))}`, pct(item.saved, item.target)])), { text: `${snapshot.goals.count} goals` })}
      ${editableSection("goals")}
    </section>
    <section class="grid two">
      ${card("Forecasted milestones", "Planning gives budgeting purpose", `
        <div class="timeline">
          ${data.goals.map((goal, index) => [[ "Aug 15", "Oct 01", "Dec 20" ][index] || "Next cycle", `${goal.name} reaches ${pct(goal.saved, goal.target)}%`, `Current monthly contribution is ${money(numberValue(goal.monthly))}.`]).map(([a,b,c]) => `
            <div class="timeline-item"><span class="timeline-date">${a}</span><div><strong>${b}</strong><div class="muted">${c}</div></div><span class="badge blue">Forecast</span></div>
          `).join("")}
        </div>
      `, { text: `${money(snapshot.goals.monthly)}/mo` })}
    </section>
  `;
}

function debt() {
  const data = appData();
  const snapshot = AheadBudgetEngine.buildSnapshot(data);
  return `
    <section class="grid two">
      ${card("Debt overview", "Current balances, minimums, extra payments, and strategy placeholders", rows(data.debts.map((item) => [item.name, `${numberValue(item.rate)}% APR | ${item.payoffStrategy || "Minimums only"}`, money(numberValue(item.balance)), money(AheadBudgetEngine.debtPayment(item))])), { text: "Current" })}
      ${editableSection("debts")}
    </section>
    <section class="grid two">
      ${card("Strategy comparison", "Different payoff paths create different tradeoffs", `
        <div class="stack">
          ${[
            ["Avalanche", "Highest interest first", "Saves more interest"],
            ["Snowball", "Smallest balance first", "Builds visible momentum"],
            ["Balanced", "Minimums plus targeted extra", "Keeps flexibility"],
          ].map(([a,b,c]) => `<div class="list-row"><div><strong>${a}</strong><div class="muted">${b}</div></div><span class="badge">${c}</span></div>`).join("")}
        </div>
      `, { text: `${money(snapshot.debt.extraPayments)} extra`, tone: "blue" })}
    </section>
  `;
}

function timeline() {
  const data = appData();
  const projection = AheadTimelineEngine.buildProjection(data);
  const balances = projection.events.map((event) => event.runningBalance);
  const maxBalance = Math.max(...balances, 1);
  const runwayBars = balances.map((balance) => Math.max(8, Math.round((Math.max(balance, 0) / maxBalance) * 100)));
  return `
    ${card("Timeline projection", "Chronological local forecast using editable data", `
      ${timelineDeficitNotice(projection)}
      <div class="timeline-summary">
        <div><span class="metric-label">Starting balance</span><strong class="metric-value">${money(projection.startingBalance)}</strong></div>
        <div><span class="metric-label">Projected balance</span><strong class="metric-value">${money(projection.projectedBalance)}</strong></div>
        <div><span class="metric-label">Timeline status</span><strong class="metric-value">${projection.status.value}</strong></div>
      </div>
      <div class="timeline">
        ${projection.events.map(timelineCard).join("")}
      </div>
    `, { text: projection.status.value, tone: projection.status.tone })}
    <section class="grid two">
      ${card("Projected balance path", projection.status.detail, bars(runwayBars), { text: "Local only", tone: projection.firstDeficit ? "gold" : "blue" })}
      ${editableSection("futureEvents")}
    </section>
    <section class="grid two">
      ${card("Decision layers", "The product language reserved for future intelligence", rows(Object.entries(futureDecisionLayers).map(([a, b]) => [a, b, "Ready", ""])), { text: "Scalable", tone: "blue" })}
      ${card("Timeline Engine inputs", "What this MVP forecast includes", rows([
        ["Accounts", "Checking and cash balances set the starting point", "Local data", ""],
        ["Income and bills", "Paydays add cash; obligations reduce it", "Chronological", ""],
        ["Goals and debt", "Monthly goal funding and minimum debt payments are projected", "Placeholder timing", ""],
        ["Future events", "User-created events are included in the running balance", "Editable", ""],
      ]), { text: dataSourceBadge().text, tone: dataSourceBadge().tone })}
    </section>
  `;
}

function whatif() {
  const summaries = AheadDecisionEngine.listDecisionScenarios();
  const liveSummary = liveScenarioSummary || AheadDecisionEngine.evaluateLiveScenario(whatIfFormState, baseline());
  return `
    <section class="grid two">
      ${whatIfScenarioForm()}
      ${sampleScenarioButtons()}
    </section>
    ${decisionSummary(liveSummary)}
    ${decisionDebugCards(liveSummary)}
    <section class="grid two">
      ${card("How Ahead reads this", "Placeholder logic showing how future scenario modeling will explain consequences.", `
        <div class="stack">
          <div class="list-row"><div><strong>Status impact</strong><div class="muted">How the scenario changes the plan condition.</div></div><span class="badge blue">Visible</span></div>
          <div class="list-row"><div><strong>Tradeoffs</strong><div class="muted">What improves, what tightens, and what remains unchanged.</div></div><span class="badge">Explained</span></div>
          <div class="list-row"><div><strong>Educational insight</strong><div class="muted">Plain-language context without judgment.</div></div><span class="badge">Included</span></div>
        </div>
      `, { text: "Foundation", tone: "blue" })}
      ${card("Static examples", "These remain visible as reference examples, separate from the live scenario above.", `
        ${rows(summaries.map((summary) => [summary.title, summary.statusImpact.detail, "Example", ""]))}
      `, { text: "Reference", tone: "blue" })}
    </section>
    ${scenarioOverview(summaries)}
    ${decisionPillarsEvaluated()}
    ${summaries.map((summary) => `${decisionSummary(summary)}${decisionDebugCards(summary)}`).join("")}
  `;
}

function insights() {
  return `
    <section class="grid three">
      ${sample.insights.map(([title, detail], index) => card(title, detail, `
        <div class="progress"><span style="width:${[82, 68, 71][index]}%"></span></div>
      `, { text: ["Signal", "Tradeoff", "Watch"][index], tone: ["", "blue", "gold"][index] })).join("")}
    </section>
    ${card("Financial learning curve", "Ahead should educate without judging.", `
      <div class="grid two">
        <div><h3>${philosophy.mission}</h3><p class="muted">${philosophy.promise}</p></div>
        <div>${rows([["Explain", "Show why a pattern matters", "Context"], ["Compare", "Make tradeoffs visible", "Choice"], ["Prepare", "Plan forward before decisions", "Confidence"]])}</div>
      </div>
    `, { text: "Principles" })}
  `;
}

function settings() {
  const developerMode = isDeveloperMode();
  const current = baseline();
  return `
    <section class="grid two">
      ${card("Financial preferences", "Tailor Ahead to the way you plan", `
        <div class="form-grid">
          <div class="field"><label for="cycle">Budget cycle</label><select id="cycle"><option>Monthly</option><option>Biweekly</option><option>Custom</option></select></div>
          <div class="field"><label for="runway">Preferred runway</label><select id="runway"><option>21 days</option><option>30 days</option><option>45 days</option></select></div>
          <div class="field"><label for="tone">Guidance tone</label><select id="tone"><option>Neutral and educational</option><option>Brief and direct</option><option>Detailed coaching</option></select></div>
          <div class="field"><label for="currency">Currency</label><select id="currency"><option>USD</option><option>CAD</option><option>EUR</option></select></div>
        </div>
      `, { text: "Control" })}
      ${card("Notifications", "Helpful context without noise", `
        ${[["Upcoming obligations", "Notify before major bills change runway"], ["Decision windows", "Highlight good timing for transfers"], ["Spending pace", "Flag patterns without judgment"]].map(([a,b]) => `
          <div class="toggle-row"><div><strong>${a}</strong><div class="muted">${b}</div></div><div class="switch" role="switch" aria-checked="true"><span></span></div></div>
        `).join("")}
      `, { text: "Intentional" })}
    </section>
    ${card("Developer Mode", "Reveal placeholder reasoning used by the Decision Engine UI.", `
      <div class="toggle-row">
        <div>
          <strong>Show Decision Engine reasoning</strong>
          <div class="muted">When enabled, What If displays debug cards for placeholder inputs, triggered pillars, status reasoning, and future calculation replacements.</div>
        </div>
        <button class="switch ${developerMode ? "active" : ""}" id="developerModeToggle" type="button" role="switch" aria-checked="${developerMode}">
          <span></span>
        </button>
      </div>
    `, { text: developerMode ? "On" : "Off", tone: developerMode ? "gold" : "blue" })}
    ${card("Demo Mode", "Reset the app back to realistic TFLC demo data. This clears user-edited localStorage data only.", `
      <div class="stack">
        <div class="list-row"><div><strong>Current data source</strong><div class="muted">Demo data, user-edited local data, and placeholder decision logic are separate.</div></div><span class="badge ${current.source === "local" ? "blue" : "gold"}">${current.source === "local" ? "User-edited local data" : "Demo data"}</span></div>
        <div class="list-row"><div><strong>What resets</strong><div class="muted">Accounts, income, bills, bill history, budget categories, goals, debt, and future timeline events return to demo values.</div></div><button class="ghost-button danger-button" id="resetDemoData" type="button">Reset to Demo Data</button></div>
      </div>
    `, { text: "Local only", tone: "blue" })}
  `;
}

const renderers = { dashboard, budget, income, bills, goals, debt, timeline, whatif, insights, settings };

function renderNav() {
  qs("#desktopNav").innerHTML = screens.map(navMarkup).join("");
  qs("#mobileNav").innerHTML = screens.map(navMarkup).join("");
}

function render() {
  const requested = (window.location.hash.replace("#", "") || "dashboard").split("?")[0];
  const current = screens.find((screen) => screen.id === requested) || screens[0];
  qs("#pageTitle").textContent = current.label;
  qs("#pageSubtitle").textContent = current.purpose;
  qs("#pageEyebrow").textContent = "A TFLC Product";
  qs("#screen").innerHTML = `${answerPanel(current.id)}${renderers[current.id]()}`;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === current.id);
  });
  bindInteractiveControls();
}

function bindInteractiveControls() {
  const developerToggle = qs("#developerModeToggle");
  if (developerToggle) {
    developerToggle.addEventListener("click", () => {
      setDeveloperMode(!isDeveloperMode());
      render();
    });
  }

  const whatIfForm = qs("#whatIfForm");
  if (whatIfForm) {
    whatIfForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(whatIfForm);
      const rawAmount = formData.get("amount");
      if (!isValidCurrencyInput(rawAmount, false)) {
        qs("#scenarioAmount")?.setCustomValidity("Enter a valid dollar amount with no more than two decimal places.");
        whatIfForm.reportValidity();
        qs("#scenarioAmount")?.setCustomValidity("");
        return;
      }
      whatIfFormState = {
        name: String(formData.get("name") || ""),
        type: String(formData.get("type") || "purchase"),
        amount: normalizeCurrencyValue(rawAmount),
        target: String(formData.get("target") || ""),
        timing: String(formData.get("timing") || "today"),
        customDate: String(formData.get("customDate") || ""),
      };
      liveScenarioSummary = AheadDecisionEngine.evaluateLiveScenario(whatIfFormState, baseline());
      render();
    });
  }

  document.querySelectorAll("[data-sample-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const sampleScenario = sampleWhatIfScenarios[Number(button.dataset.sampleIndex)];
      whatIfFormState = { ...sampleScenario };
      liveScenarioSummary = AheadDecisionEngine.evaluateLiveScenario(whatIfFormState, baseline());
      render();
    });
  });

  document.querySelectorAll(".data-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const collection = form.dataset.collection;
      const config = Object.values(editorConfigs).find((entry) => entry.collection === collection);
      const formData = new FormData(form);
      const item = {};
      let hasInvalidCurrency = false;

      config.fields.forEach((field) => {
        const value = formData.get(field.key);
        if (field.currency) {
          const input = form.querySelector(`[name="${field.key}"]`);
          if (!isValidCurrencyInput(value, Boolean(field.allowNegative))) {
            input?.setCustomValidity("Enter a valid dollar amount with no more than two decimal places.");
            form.reportValidity();
            input?.setCustomValidity("");
            hasInvalidCurrency = true;
            return;
          }
          item[field.key] = normalizeCurrencyValue(value);
          return;
        }
        item[field.key] = field.type === "number" ? numberValue(value) : String(value || "");
      });

      if (hasInvalidCurrency) return;

      const id = String(formData.get("id") || "");
      if (id) item.id = id;
      AheadLocalData.upsert(collection, item);
      if (inlineEditState.collection === collection && inlineEditState.id === id) {
        inlineEditState = { collection: null, id: null };
      }
      liveScenarioSummary = null;
      render();
    });
  });

  document.querySelectorAll("[data-edit-collection]").forEach((button) => {
    button.addEventListener("click", () => {
      inlineEditState = {
        collection: button.dataset.editCollection,
        id: button.dataset.editId,
      };
      render();
    });
  });

  document.querySelectorAll("[data-cancel-inline-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      inlineEditState = { collection: null, id: null };
      render();
    });
  });

  document.querySelectorAll("[data-delete-collection]").forEach((button) => {
    button.addEventListener("click", () => {
      AheadLocalData.remove(button.dataset.deleteCollection, button.dataset.deleteId);
      if (inlineEditState.collection === button.dataset.deleteCollection && inlineEditState.id === button.dataset.deleteId) {
        inlineEditState = { collection: null, id: null };
      }
      liveScenarioSummary = null;
      render();
    });
  });

  const resetDemoData = qs("#resetDemoData");
  if (resetDemoData) {
    resetDemoData.addEventListener("click", () => {
      AheadLocalData.resetDemoData();
      liveScenarioSummary = null;
      render();
    });
  }
}

function initTheme() {
  const saved = localStorage.getItem("ahead-theme");
  if (saved) document.documentElement.dataset.theme = saved;
  qs("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("ahead-theme", next);
  });
}

renderNav();
initTheme();
window.addEventListener("hashchange", render);
render();
