const AheadTimelineEngine = (() => {
  const horizonDays = 45;

  function numberValue(value) {
    return Number(value || 0);
  }

  function billAmount(bill) {
    return window.AheadBudgetEngine?.billAmount
      ? window.AheadBudgetEngine.billAmount(bill)
      : numberValue(bill.actualAmount || bill.estimatedAmount || bill.amount);
  }

  function debtPayment(debt) {
    return window.AheadBudgetEngine?.debtPayment
      ? window.AheadBudgetEngine.debtPayment(debt)
      : numberValue(debt.payment) + numberValue(debt.extraPayment);
  }

  function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  function startOfDay(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function parseDate(value, today = startOfDay()) {
    if (!value) return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) return startOfDay(value);

    const raw = String(value).trim();
    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    }

    if (/today/i.test(raw)) return startOfDay(today);

    const parsed = new Date(`${raw} ${today.getFullYear()}`);
    if (Number.isNaN(parsed.getTime())) return null;

    let normalized = startOfDay(parsed);
    if (normalized < today) {
      normalized = new Date(today.getFullYear() + 1, normalized.getMonth(), normalized.getDate());
    }
    return normalized;
  }

  function formatDate(date, today = startOfDay()) {
    if (date.getTime() === today.getTime()) return "Today";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function dateKey(date) {
    return date.toISOString().slice(0, 10);
  }

  function startingBalance(data) {
    return (data.accounts || [])
      .filter((account) => ["checking", "cash"].includes(String(account.type || "").toLowerCase()))
      .reduce((total, account) => total + numberValue(account.balance), 0);
  }

  function nearestIncomeDate(data, today) {
    const incomeDates = (data.income || [])
      .map((income) => parseDate(income.date, today))
      .filter(Boolean)
      .sort((a, b) => a - b);
    return incomeDates[0] || addDays(today, 7);
  }

  function eventStatus(balance, amount) {
    if (balance < 0) return "Deficit";
    if (amount > 0) return "Improves";
    if (balance < 500) return "Watch";
    return "Stable";
  }

  function normalizeEvent(event, today, index) {
    const date = parseDate(event.date, today);
    if (!date) return null;
    return {
      id: event.id || `timeline-event-${index}`,
      sourceId: event.sourceId || event.id || `timeline-source-${index}`,
      sourceType: event.sourceType || event.type || "event",
      type: event.type || "event",
      date,
      dateKey: dateKey(date),
      title: event.title || event.name || "Planned event",
      amount: numberValue(event.amount),
      detail: event.detail || "",
      confidence: event.confidence || event.status || "Planned",
    };
  }

  function collectEvents(data, today = startOfDay()) {
    const incomeEvents = (data.income || []).map((income) => ({
      id: `timeline-${income.id}`,
      sourceId: income.id,
      sourceType: "income",
      type: "Income",
      date: income.date,
      title: income.name,
      amount: numberValue(income.amount),
      detail: `${income.status || "Expected"} income increases planning cushion.`,
      confidence: income.status || "Expected",
    }));

    const billEvents = (data.bills || []).map((bill) => ({
      id: `timeline-${bill.id}`,
      sourceId: bill.id,
      sourceType: "bill",
      type: "Bill",
      date: bill.dueDate,
      title: bill.name,
      amount: -Math.abs(billAmount(bill)),
      detail: `${bill.billType || bill.status || "Planned"} obligation reduces available cash.`,
      confidence: bill.status || "Planned",
    }));

    const firstIncome = nearestIncomeDate(data, today);
    const goalEvents = (data.goals || [])
      .filter((goal) => numberValue(goal.monthly) > 0)
      .map((goal, index) => ({
        id: `timeline-goal-${goal.id}`,
        sourceId: goal.id,
        sourceType: "goal",
        type: "Savings transfer",
        date: addDays(firstIncome, 2 + index),
        title: `${goal.name} contribution`,
        amount: -Math.abs(numberValue(goal.monthly)),
        detail: "Planned goal funding moves money toward future priorities.",
        confidence: "Planned",
      }));

    const debtEvents = (data.debts || []).map((debt, index) => {
      const relatedBill = (data.bills || []).find((bill) => {
        const billName = String(bill.name || "").toLowerCase();
        const debtName = String(debt.name || "").toLowerCase();
        return billName.includes(debtName) || debtName.includes(billName);
      });
      if (relatedBill) return null;
      return {
        id: `timeline-debt-${debt.id}`,
        sourceId: debt.id,
        sourceType: "debt",
        type: "Debt payment",
        date: addDays(today, 14 + index * 4),
        title: `${debt.name} payment`,
        amount: -Math.abs(debtPayment(debt)),
        detail: "Tracked debt minimum and extra payment included in the forward plan.",
        confidence: "Estimated",
      };
    }).filter(Boolean);

    const manualEvents = (data.futureEvents || []).map((event) => ({
      id: event.id,
      sourceId: event.id,
      sourceType: "futureEvent",
      type: event.type || "Future event",
      date: event.date,
      title: event.name,
      amount: numberValue(event.amount),
      detail: event.notes || "User-created future event.",
      confidence: "User-entered",
    }));

    return [...incomeEvents, ...billEvents, ...goalEvents, ...debtEvents, ...manualEvents]
      .map((event, index) => normalizeEvent(event, today, index))
      .filter(Boolean)
      .filter((event) => event.date >= today && event.date <= addDays(today, horizonDays))
      .sort((a, b) => a.date - b.date || b.amount - a.amount || a.title.localeCompare(b.title));
  }

  function buildProjection(data, options = {}) {
    const today = startOfDay(options.today || new Date());
    const startBalance = startingBalance(data);
    let runningBalance = startBalance;
    let firstDeficit = null;

    const opening = {
      id: "timeline-opening",
      type: "Opening balance",
      date: today,
      dateLabel: "Today",
      title: "Starting checking balance",
      amount: 0,
      runningBalance,
      status: runningBalance < 0 ? "Deficit" : "Stable",
      detail: "Projection starts from local checking and cash balances.",
      confidence: "Local data",
    };

    const events = collectEvents(data, today).map((event) => {
      runningBalance += event.amount;
      const projected = {
        ...event,
        dateLabel: formatDate(event.date, today),
        runningBalance,
        status: eventStatus(runningBalance, event.amount),
      };

      if (!firstDeficit && runningBalance < 0) {
        firstDeficit = projected;
      }

      return projected;
    });

    const status = firstDeficit
      ? {
          value: "Behind",
          tone: "gold",
          detail: `${firstDeficit.title} would move the projected balance below zero on ${firstDeficit.dateLabel}.`,
        }
      : {
          value: runningBalance < 1000 ? "Stable" : "Ahead",
          tone: runningBalance < 1000 ? "" : "blue",
          detail: runningBalance < 1000
            ? "Future obligations remain covered, with limited flexibility near the end of the projection."
            : "Future obligations remain covered in the local projection.",
        };

    return {
      startingBalance: startBalance,
      projectedBalance: runningBalance,
      status,
      firstDeficit,
      events: [opening, ...events],
      debug: {
        eventCount: events.length,
        horizonDays,
        sources: ["accounts", "income", "bills", "goals", "debts", "futureEvents"],
      },
    };
  }

  return {
    buildProjection,
  };
})();

window.AheadTimelineEngine = AheadTimelineEngine;
