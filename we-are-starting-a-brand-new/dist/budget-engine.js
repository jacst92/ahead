const AheadBudgetEngine = (() => {
  function numberValue(value) {
    return Number(value || 0);
  }

  function sum(items, selector) {
    return (items || []).reduce((total, item) => total + selector(item), 0);
  }

  function percent(part, whole) {
    if (!whole) return 0;
    return Math.max(0, Math.min(100, Math.round((part / whole) * 100)));
  }

  function billAmount(bill) {
    const actual = numberValue(bill.actualAmount);
    if (actual > 0) return actual;
    const estimated = numberValue(bill.estimatedAmount);
    if (estimated > 0) return estimated;
    return numberValue(bill.amount);
  }

  function billHistoryFor(data, bill) {
    const billName = String(bill.name || "").toLowerCase();
    return (data.billHistory || []).filter((entry) => (
      entry.billId === bill.id
      || String(entry.billName || "").toLowerCase() === billName
    ));
  }

  function billAverage(data, bill) {
    const history = billHistoryFor(data, bill).filter((entry) => numberValue(entry.actualAmount) > 0);
    if (!history.length) return 0;
    return Number((sum(history, (entry) => numberValue(entry.actualAmount)) / history.length).toFixed(2));
  }

  function billVariance(bill) {
    const actual = numberValue(bill.actualAmount);
    if (actual <= 0) return 0;
    const estimate = numberValue(bill.estimatedAmount || bill.amount);
    return Number((actual - estimate).toFixed(2));
  }

  function suggestedBillEstimate(data, bill) {
    return billAverage(data, bill) || numberValue(bill.estimatedAmount || bill.amount);
  }

  function debtPayment(debt) {
    return numberValue(debt.payment) + numberValue(debt.extraPayment);
  }

  function accountSummary(data) {
    const accounts = data.accounts || [];
    const positiveCash = sum(accounts.filter((account) => numberValue(account.balance) > 0), (account) => numberValue(account.balance));
    const negativeBalances = Math.abs(sum(accounts.filter((account) => numberValue(account.balance) < 0), (account) => numberValue(account.balance)));
    return {
      count: accounts.length,
      positiveCash,
      negativeBalances,
      netWorthPlaceholder: positiveCash - negativeBalances,
    };
  }

  function incomeSummary(data) {
    const income = data.income || [];
    return {
      count: income.length,
      total: sum(income, (item) => numberValue(item.amount)),
      recurringTotal: sum(income.filter((item) => item.recurring === "Yes"), (item) => numberValue(item.amount)),
      customSchedules: income.filter((item) => item.schedule === "Custom").length,
      confirmed: sum(income.filter((item) => item.status === "Confirmed"), (item) => numberValue(item.amount)),
      expected: sum(income.filter((item) => item.status !== "Confirmed"), (item) => numberValue(item.amount)),
    };
  }

  function billSummary(data) {
    const bills = data.bills || [];
    const actualBills = bills.filter((bill) => numberValue(bill.actualAmount) > 0);
    const totalVariance = sum(actualBills, billVariance);
    const averageVariance = actualBills.length ? Number((totalVariance / actualBills.length).toFixed(2)) : 0;
    return {
      count: bills.length,
      total: sum(bills, billAmount),
      fixed: sum(bills.filter((bill) => bill.billType === "Fixed"), billAmount),
      variable: sum(bills.filter((bill) => bill.billType === "Variable"), billAmount),
      estimated: sum(bills.filter((bill) => bill.billType === "Estimated" || numberValue(bill.actualAmount) === 0), billAmount),
      actual: sum(bills.filter((bill) => numberValue(bill.actualAmount) > 0), billAmount),
      historyCount: (data.billHistory || []).length,
      totalVariance,
      averageVariance,
    };
  }

  function categorySummary(data) {
    const categories = data.budgetCategories || [];
    const planned = sum(categories, (item) => numberValue(item.planned));
    const spent = sum(categories, (item) => numberValue(item.spent));
    return {
      count: categories.length,
      planned,
      spent,
      remaining: planned - spent,
      usedPercent: percent(spent, planned),
    };
  }

  function goalSummary(data) {
    const goals = data.goals || [];
    const target = sum(goals, (goal) => numberValue(goal.target));
    const saved = sum(goals, (goal) => numberValue(goal.saved));
    return {
      count: goals.length,
      target,
      saved,
      monthly: sum(goals, (goal) => numberValue(goal.monthly)),
      savings: goals.filter((goal) => goal.goalType === "Savings").length,
      debtPayoff: goals.filter((goal) => goal.goalType === "Debt payoff").length,
      investment: goals.filter((goal) => goal.goalType === "Investment").length,
      progress: percent(saved, target),
    };
  }

  function debtSummary(data) {
    const debts = data.debts || [];
    return {
      count: debts.length,
      balance: sum(debts, (debt) => numberValue(debt.balance)),
      minimums: sum(debts, (debt) => numberValue(debt.payment)),
      extraPayments: sum(debts, (debt) => numberValue(debt.extraPayment)),
      totalPayments: sum(debts, debtPayment),
      highestRate: debts.reduce((highest, debt) => Math.max(highest, numberValue(debt.rate)), 0),
    };
  }

  function buildSnapshot(data) {
    const accounts = accountSummary(data);
    const income = incomeSummary(data);
    const bills = billSummary(data);
    const categories = categorySummary(data);
    const goals = goalSummary(data);
    const debt = debtSummary(data);
    const availableCushion = accounts.positiveCash - bills.total - goals.monthly - debt.totalPayments;
    const netPlannedCashFlow = income.total - bills.total - goals.monthly - debt.totalPayments;

    return {
      accounts,
      income,
      bills,
      categories,
      goals,
      debt,
      availableCushion,
      netPlannedCashFlow,
      aheadDays: Math.max(0, Math.round(availableCushion / Math.max((bills.total + debt.totalPayments) / 30, 1))),
      status: availableCushion < 0 ? "Behind" : availableCushion < 1000 ? "Stable" : "Ahead",
    };
  }

  return {
    billAmount,
    billAverage,
    billHistoryFor,
    billVariance,
    suggestedBillEstimate,
    debtPayment,
    buildSnapshot,
  };
})();

window.AheadBudgetEngine = AheadBudgetEngine;
