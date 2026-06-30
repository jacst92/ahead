const AheadLocalData = (() => {
  const storageKey = "ahead-local-budget-data-v1";

  const demoData = {
    meta: {
      source: "demo",
      updatedAt: null,
    },
    accounts: [
      { id: "acct-checking", name: "Everyday Checking", type: "Checking", balance: 4820 },
      { id: "acct-savings", name: "Emergency Savings", type: "Savings", balance: 8400 },
      { id: "acct-credit", name: "Rewards Credit Card", type: "Credit", balance: -2140 },
    ],
    income: [
      { id: "income-payroll", name: "Payroll", date: "Jun 28", amount: 3420, status: "Confirmed", recurring: "Yes", schedule: "Biweekly", customSchedule: "" },
      { id: "income-freelance", name: "Freelance retainer", date: "Jul 03", amount: 1200, status: "Expected", recurring: "Yes", schedule: "Monthly", customSchedule: "First week of each month" },
      { id: "income-interest", name: "Interest", date: "Jul 05", amount: 18, status: "Projected", recurring: "Yes", schedule: "Monthly", customSchedule: "" },
    ],
    bills: [
      { id: "bill-rent", name: "Rent", dueDate: "Jul 01", amount: 1950, estimatedAmount: 1950, actualAmount: 0, billType: "Fixed", status: "Scheduled" },
      { id: "bill-utilities", name: "Utilities", dueDate: "Jul 04", amount: 164, estimatedAmount: 185, actualAmount: 164, billType: "Variable", status: "Paid" },
      { id: "bill-student", name: "Student loan", dueDate: "Jul 08", amount: 385, estimatedAmount: 385, actualAmount: 0, billType: "Fixed", status: "Autopay" },
      { id: "bill-insurance", name: "Insurance", dueDate: "Jul 12", amount: 142, estimatedAmount: 142, actualAmount: 0, billType: "Fixed", status: "Scheduled" },
    ],
    billHistory: [
      { id: "history-utilities-jun", billId: "bill-utilities", billName: "Utilities", paidDate: "Jun 04", estimatedAmount: 176, actualAmount: 168, difference: -8, createdAt: "2026-06-04T12:00:00.000Z" },
      { id: "history-utilities-jul", billId: "bill-utilities", billName: "Utilities", paidDate: "Jul 04", estimatedAmount: 185, actualAmount: 164, difference: -21, createdAt: "2026-07-04T12:00:00.000Z" },
    ],
    budgetCategories: [
      { id: "cat-home", name: "Home", planned: 1950, spent: 1600, type: "Need" },
      { id: "cat-food", name: "Food", planned: 760, spent: 540, type: "Need" },
      { id: "cat-transport", name: "Transportation", planned: 430, spent: 280, type: "Need" },
      { id: "cat-lifestyle", name: "Lifestyle", planned: 520, spent: 350, type: "Want" },
      { id: "cat-future", name: "Future", planned: 900, spent: 640, type: "Future" },
    ],
    goals: [
      { id: "goal-emergency", name: "Emergency fund", goalType: "Savings", target: 12000, saved: 8400, monthly: 450 },
      { id: "goal-travel", name: "Holiday travel", goalType: "Savings", target: 2000, saved: 1150, monthly: 250 },
      { id: "goal-invest", name: "Index fund starter", goalType: "Investment", target: 5000, saved: 900, monthly: 200 },
      { id: "goal-card-payoff", name: "Credit card payoff", goalType: "Debt payoff", target: 2140, saved: 480, monthly: 240 },
    ],
    debts: [
      { id: "debt-student", name: "Student loan", balance: 18240, rate: 5.8, payment: 385, extraPayment: 0, payoffStrategy: "Avalanche placeholder" },
      { id: "debt-auto", name: "Auto loan", balance: 9800, rate: 4.2, payment: 410, extraPayment: 0, payoffStrategy: "Minimums only" },
      { id: "debt-card", name: "Credit card", balance: 2140, rate: 18.4, payment: 240, extraPayment: 75, payoffStrategy: "Avalanche placeholder" },
    ],
    futureEvents: [
      { id: "event-emergency-transfer", name: "Emergency fund transfer", date: "Jul 08", amount: -250, type: "Savings transfer", notes: "Planned transfer after rent and utilities clear." },
      { id: "event-family-visit", name: "Family visit", date: "Jul 18", amount: -320, type: "Future event", notes: "User-created planning item for travel and meals." },
    ],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load() {
    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      const initial = clone(demoData);
      save(initial, "demo");
      return initial;
    }

    try {
      return { ...clone(demoData), ...JSON.parse(stored) };
    } catch {
      const fallback = clone(demoData);
      save(fallback, "demo");
      return fallback;
    }
  }

  function save(data, source = "local") {
    const next = {
      ...data,
      meta: {
        ...(data.meta || {}),
        source,
        updatedAt: new Date().toISOString(),
      },
    };
    localStorage.setItem(storageKey, JSON.stringify(next));
    return next;
  }

  function resetDemoData() {
    const reset = clone(demoData);
    return save(reset, "demo");
  }

  function makeId(collection) {
    return `${collection}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function numberValue(value) {
    return Number(value || 0);
  }

  function billEstimate(bill) {
    return numberValue(bill.estimatedAmount || bill.amount);
  }

  function billHistoryEntry(bill, previousBill) {
    const actualAmount = numberValue(bill.actualAmount);
    if (actualAmount <= 0) return null;

    const previousActual = numberValue(previousBill?.actualAmount);
    if (previousBill && previousActual === actualAmount) return null;

    const estimatedAmount = billEstimate(bill);
    return {
      id: makeId("billHistory"),
      billId: bill.id,
      billName: bill.name,
      paidDate: bill.dueDate || new Date().toISOString().slice(0, 10),
      estimatedAmount,
      actualAmount,
      difference: Number((actualAmount - estimatedAmount).toFixed(2)),
      createdAt: new Date().toISOString(),
    };
  }

  function upsert(collection, item) {
    const data = load();
    const id = item.id || makeId(collection);
    const nextItem = { ...item, id };
    const existing = data[collection] || [];
    const index = existing.findIndex((entry) => entry.id === id);
    const nextCollection = index >= 0
      ? existing.map((entry) => (entry.id === id ? nextItem : entry))
      : [...existing, nextItem];
    const nextData = { ...data, [collection]: nextCollection };

    if (collection === "bills") {
      const previousBill = index >= 0 ? existing[index] : null;
      const historyEntry = billHistoryEntry(nextItem, previousBill);
      if (historyEntry) {
        nextData.billHistory = [...(data.billHistory || []), historyEntry];
      }
    }

    return save(nextData, "local");
  }

  function remove(collection, id) {
    const data = load();
    const nextData = { ...data, [collection]: (data[collection] || []).filter((entry) => entry.id !== id) };
    if (collection === "bills") {
      nextData.billHistory = (data.billHistory || []).filter((entry) => entry.billId !== id);
    }
    return save(nextData, "local");
  }

  function sum(items, field) {
    return (items || []).reduce((total, item) => total + Number(item[field] || 0), 0);
  }

  function effectiveBillAmount(bill) {
    return Number(bill.actualAmount || bill.estimatedAmount || bill.amount || 0);
  }

  function percent(part, whole) {
    if (!whole) return 0;
    return Math.max(0, Math.min(100, Math.round((part / whole) * 100)));
  }

  function getBaseline(data = load()) {
    const budgetSnapshot = window.AheadBudgetEngine?.buildSnapshot(data);
    if (budgetSnapshot) {
      return {
        positiveCash: budgetSnapshot.accounts.positiveCash,
        upcomingBills: budgetSnapshot.bills.total,
        expectedIncome: budgetSnapshot.income.total,
        plannedBudget: budgetSnapshot.categories.planned,
        spentBudget: budgetSnapshot.categories.spent,
        goalTarget: budgetSnapshot.goals.target,
        goalSaved: budgetSnapshot.goals.saved,
        goalProgress: budgetSnapshot.goals.progress,
        debtBalance: budgetSnapshot.debt.balance + budgetSnapshot.accounts.negativeBalances,
        debtMinimums: budgetSnapshot.debt.totalPayments,
        availableCushion: budgetSnapshot.availableCushion,
        aheadDays: budgetSnapshot.aheadDays,
        source: data.meta?.source || "demo",
        budgetSnapshot,
      };
    }

    const positiveCash = sum((data.accounts || []).filter((account) => Number(account.balance) > 0), "balance");
    const debtAccountBalances = Math.abs(sum((data.accounts || []).filter((account) => Number(account.balance) < 0), "balance"));
    const upcomingBills = (data.bills || []).reduce((total, bill) => total + effectiveBillAmount(bill), 0);
    const expectedIncome = sum(data.income, "amount");
    const plannedBudget = sum(data.budgetCategories, "planned");
    const spentBudget = sum(data.budgetCategories, "spent");
    const goalTarget = sum(data.goals, "target");
    const goalSaved = sum(data.goals, "saved");
    const debtBalance = sum(data.debts, "balance") + debtAccountBalances;
    const debtMinimums = (data.debts || []).reduce((total, debt) => total + Number(debt.payment || 0) + Number(debt.extraPayment || 0), 0);
    const goalMonthly = sum(data.goals, "monthly");
    const availableCushion = positiveCash - upcomingBills - debtMinimums - goalMonthly;

    return {
      positiveCash,
      upcomingBills,
      expectedIncome,
      plannedBudget,
      spentBudget,
      goalTarget,
      goalSaved,
      goalProgress: percent(goalSaved, goalTarget),
      debtBalance,
      debtMinimums,
      availableCushion,
      aheadDays: Math.max(0, Math.round((availableCushion / Math.max(upcomingBills / 30, 1)))),
      source: data.meta?.source || "demo",
    };
  }

  return {
    load,
    save,
    upsert,
    remove,
    resetDemoData,
    getBaseline,
    demoData: clone(demoData),
  };
})();

window.AheadLocalData = AheadLocalData;
