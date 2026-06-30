var AheadDecisionEngine = (() => {
  const STATUS = Object.freeze({
    AHEAD: "Ahead",
    STABLE: "Stable",
    RECOVERING: "Recovering",
    BEHIND: "Behind",
  });

  const PILLARS = Object.freeze([
    "Cash Flow",
    "Obligations",
    "Goals",
    "Debt",
    "Emergency Preparedness",
    "Intentional Progress",
  ]);

  const STATUS_INPUTS = Object.freeze([
    "Cash flow",
    "Upcoming bills",
    "Income timing",
    "Budget categories",
    "Savings goals",
    "Debt obligations",
    "Emergency fund target",
    "User-selected priorities",
  ]);

  const scenarioSummaries = {
    emergencyFundTransfer: {
      id: "emergencyFundTransfer",
      title: "Transfer $450.00 to emergency savings",
      statusImpact: {
        label: "Status impact",
        value: STATUS.STABLE,
        detail: "This would keep the plan stable while reducing post-rent runway from 21 days to 18 days.",
        tone: "blue",
      },
      billsImpact: {
        label: "Bills impact",
        value: "Covered",
        detail: "Upcoming rent, utilities, and debt minimums remain planned if payroll posts first.",
        tone: "green",
      },
      goalImpact: {
        label: "Goal impact",
        value: "+4%",
        detail: "Emergency savings would move from 70% to 74% funded.",
        tone: "green",
      },
      debtImpact: {
        label: "Debt impact",
        value: "No change",
        detail: "Minimum payments stay intact, with no extra payoff applied in this scenario.",
        tone: "blue",
      },
      emergencyFundImpact: {
        label: "Emergency fund impact",
        value: "Stronger buffer",
        detail: "This option may fit if near-term confidence matters more than maximum cash flexibility.",
        tone: "green",
      },
      tradeoffs: [
        "This would affect available cash after rent.",
        "One path to consider is waiting until payroll posts, then funding the transfer.",
        "Choose the path that fits your priorities.",
      ],
      educationalInsight:
        "A transfer can be affordable and still create a timing tradeoff. Ahead separates whether money exists from when that money is safest to move.",
      debug: {
        placeholderInputs: [
          "Available cash: $8,420.00",
          "Upcoming rent: $1,950.00",
          "Confirmed payroll: Jun 28",
          "Emergency fund progress: 70%",
          "User priority: confidence and flexibility",
        ],
        pillarsTriggered: ["Cash Flow", "Obligations", "Goals", "Emergency Preparedness", "Intentional Progress"],
        statusReason:
          "The placeholder model keeps the scenario Stable because bills remain covered while runway narrows after the transfer.",
        futureReplacement:
          "Future logic will calculate post-decision runway, bill coverage probability, goal forecast movement, and emergency fund target variance from live plan data.",
      },
    },
    extraDebtPayment: {
      id: "extraDebtPayment",
      title: "Make an extra $300.00 credit card payment",
      statusImpact: {
        label: "Status impact",
        value: STATUS.STABLE,
        detail: "This would preserve core obligations while narrowing flexible cash for the next 10 days.",
        tone: "blue",
      },
      billsImpact: {
        label: "Bills impact",
        value: "Covered",
        detail: "Bills stay covered if discretionary spending remains within the current daily range.",
        tone: "green",
      },
      goalImpact: {
        label: "Goal impact",
        value: "Slower",
        detail: "Goal funding would likely pause until the next income event.",
        tone: "gold",
      },
      debtImpact: {
        label: "Debt impact",
        value: "Interest help",
        detail: "The extra payment would reduce high-interest balance faster.",
        tone: "green",
      },
      emergencyFundImpact: {
        label: "Emergency fund impact",
        value: "No increase",
        detail: "Emergency savings would remain at the current level.",
        tone: "blue",
      },
      tradeoffs: [
        "This option may fit if interest reduction is the priority this cycle.",
        "This would affect goal momentum more than bill coverage.",
        "Choose the path that fits your priorities.",
      ],
      educationalInsight:
        "Debt progress and emergency readiness can both be responsible priorities. The useful question is which priority creates more confidence in this cycle.",
      debug: {
        placeholderInputs: [
          "Available cash: $8,420.00",
          "Credit card balance: $2,140.00",
          "Interest priority: high",
          "Upcoming obligations: covered",
          "Goal funding window: after payroll",
        ],
        pillarsTriggered: ["Cash Flow", "Obligations", "Goals", "Debt", "Intentional Progress"],
        statusReason:
          "The placeholder model keeps the scenario Stable because required payments remain covered while extra cash is redirected toward debt.",
        futureReplacement:
          "Future logic will compare interest savings, payoff acceleration, category pressure, and emergency fund opportunity cost using real debt and budget data.",
      },
    },
  };

  const typeLabels = {
    purchase: "Purchase",
    debtPayment: "Extra Debt Payment",
    savingsContribution: "Savings Contribution",
    extraIncome: "Extra Income",
    skippedExpense: "Skipped Expense",
  };

  const timingLabels = {
    today: "Today",
    nextPaycheck: "Next paycheck",
    custom: "Custom date",
  };

  function currency(amount) {
    return Number(amount || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function normalizeScenario(input = {}) {
    const amount = Math.max(0, Number.parseFloat(String(input.amount || "0").replace(/[^0-9.]/g, "")) || 0);
    return {
      id: "liveScenario",
      isLive: true,
      name: input.name?.trim() || `${typeLabels[input.type] || "Scenario"} ${currency(amount)}`,
      type: input.type || "purchase",
      typeLabel: typeLabels[input.type] || "Purchase",
      amount,
      amountLabel: currency(amount),
      target: input.target?.trim() || "General plan",
      timing: input.timing || "today",
      timingLabel: timingLabels[input.timing] || "Today",
      customDate: input.customDate || "",
    };
  }

  function statusForScenario(scenario) {
    if (scenario.type === "extraIncome" || scenario.type === "skippedExpense") return STATUS.AHEAD;
    if (scenario.amount >= 900 && scenario.type === "purchase") return STATUS.RECOVERING;
    if (scenario.amount >= 700) return STATUS.STABLE;
    return STATUS.STABLE;
  }

  function evaluateLiveScenario(input = {}, baseline = {}) {
    const scenario = normalizeScenario(input);
    const timingPhrase = scenario.timing === "custom" && scenario.customDate ? scenario.customDate : scenario.timingLabel.toLowerCase();
    const status = statusForScenario(scenario);
    const cushion = currency(baseline.availableCushion || 0);
    const sourceLabel = baseline.source === "local" ? "user-edited local data" : "demo data";

    const base = {
      id: scenario.id,
      isLive: true,
      title: scenario.name,
      scenario,
      baseline,
    };

    if (scenario.type === "purchase") {
      return {
        ...base,
        statusImpact: {
          label: "Status impact",
          value: status,
          detail: `${scenario.amountLabel} would reduce short-term cushion ${timingPhrase}. Baseline cushion is ${cushion}.`,
          tone: scenario.amount >= 900 ? "gold" : "blue",
        },
        billsImpact: {
          label: "Bills impact",
          value: scenario.amount >= 1200 ? "Watch timing" : "Likely covered",
          detail: "Known bills remain the first planning priority in this placeholder model.",
          tone: scenario.amount >= 1200 ? "gold" : "green",
        },
        goalImpact: {
          label: "Goal impact",
          value: "May delay",
          detail: `This would affect ${scenario.target} if the purchase comes before planned goal funding.`,
          tone: "gold",
        },
        debtImpact: {
          label: "Debt impact",
          value: "No payoff change",
          detail: "Debt progress is unchanged unless the purchase competes with extra payoff money.",
          tone: "blue",
        },
        emergencyFundImpact: {
          label: "Emergency fund impact",
          value: "Cushion lower",
          detail: "Emergency readiness is not reduced directly, but flexible cash becomes tighter.",
          tone: "gold",
        },
        tradeoffs: [
          `This would affect available cushion by ${scenario.amountLabel}.`,
          "One path to consider is comparing the purchase timing against the next bill cycle.",
          "Choose the path that fits your priorities.",
        ],
        educationalInsight:
          "A purchase can fit the plan and still change timing. Ahead separates affordability from the confidence created by preserving cushion.",
        debug: debugForScenario(scenario, baseline, sourceLabel, ["Cash Flow", "Obligations", "Goals", "Intentional Progress"], "Purchase rule reduces cushion and marks goal timing as a watch point."),
      };
    }

    if (scenario.type === "savingsContribution") {
      return {
        ...base,
        statusImpact: {
          label: "Status impact",
          value: STATUS.STABLE,
          detail: `${scenario.amountLabel} would improve savings readiness while narrowing short-term cushion. Baseline cushion is ${cushion}.`,
          tone: "blue",
        },
        billsImpact: {
          label: "Bills impact",
          value: "Covered if timed",
          detail: "This option may fit if the contribution happens after required bills are accounted for.",
          tone: "green",
        },
        goalImpact: {
          label: "Goal impact",
          value: "Improves",
          detail: `${scenario.target} would move forward in the placeholder goal model.`,
          tone: "green",
        },
        debtImpact: {
          label: "Debt impact",
          value: "No change",
          detail: "Debt progress remains on the current path.",
          tone: "blue",
        },
        emergencyFundImpact: {
          label: "Emergency fund impact",
          value: "Stronger",
          detail: "Emergency preparedness improves if this contribution is directed to reserves.",
          tone: "green",
        },
        tradeoffs: [
          "This would improve preparedness while reducing cash available for near-term choices.",
          "One path to consider is waiting until the next paycheck before moving the money.",
          "Choose the path that fits your priorities.",
        ],
        educationalInsight:
          "Savings contributions create confidence, but timing still matters. The strongest plan protects both readiness and bill coverage.",
        debug: debugForScenario(scenario, baseline, sourceLabel, ["Cash Flow", "Obligations", "Goals", "Emergency Preparedness", "Intentional Progress"], "Savings rule improves emergency preparedness and narrows cash cushion."),
      };
    }

    if (scenario.type === "debtPayment") {
      return {
        ...base,
        statusImpact: {
          label: "Status impact",
          value: STATUS.STABLE,
          detail: `${scenario.amountLabel} would improve debt progress while reducing short-term flexibility. Baseline cushion is ${cushion}.`,
          tone: "blue",
        },
        billsImpact: {
          label: "Bills impact",
          value: "Covered if timed",
          detail: "Required obligations remain covered when the payment follows confirmed income.",
          tone: "green",
        },
        goalImpact: {
          label: "Goal impact",
          value: "May pause",
          detail: "Goal funding may slow if the same dollars were planned for savings.",
          tone: "gold",
        },
        debtImpact: {
          label: "Debt impact",
          value: "Improves",
          detail: `${scenario.target} would receive extra payoff progress.`,
          tone: "green",
        },
        emergencyFundImpact: {
          label: "Emergency fund impact",
          value: "No increase",
          detail: "Emergency reserves remain unchanged in this scenario.",
          tone: "blue",
        },
        tradeoffs: [
          "This option may fit if debt progress is the priority this cycle.",
          "This would affect flexibility more than required bill coverage.",
          "Choose the path that fits your priorities.",
        ],
        educationalInsight:
          "Extra debt payments can be useful progress. The key tradeoff is whether interest reduction or near-term cushion creates more confidence right now.",
        debug: debugForScenario(scenario, baseline, sourceLabel, ["Cash Flow", "Obligations", "Debt", "Goals", "Intentional Progress"], "Debt rule improves payoff progress and flags goal opportunity cost."),
      };
    }

    if (scenario.type === "extraIncome") {
      return {
        ...base,
        statusImpact: {
          label: "Status impact",
          value: STATUS.AHEAD,
          detail: `${scenario.amountLabel} of extra income would increase planning cushion. Baseline cushion is ${cushion}.`,
          tone: "green",
        },
        billsImpact: {
          label: "Bills impact",
          value: "Stronger",
          detail: "Upcoming obligations have more room in the placeholder cash-flow model.",
          tone: "green",
        },
        goalImpact: {
          label: "Goal impact",
          value: "Can accelerate",
          detail: `${scenario.target} could move faster if the income is assigned there.`,
          tone: "green",
        },
        debtImpact: {
          label: "Debt impact",
          value: "Optional upside",
          detail: "Debt payoff can improve if extra income is directed to balances.",
          tone: "blue",
        },
        emergencyFundImpact: {
          label: "Emergency fund impact",
          value: "Can improve",
          detail: "Preparedness can improve if part of the income is reserved.",
          tone: "green",
        },
        tradeoffs: [
          "This would improve cash flow and create more optionality.",
          "One path to consider is splitting the income across cushion, goals, and debt.",
          "Choose the path that fits your priorities.",
        ],
        educationalInsight:
          "Extra income increases options. Ahead frames the decision around how those dollars support priorities instead of treating them as automatic spending money.",
        debug: debugForScenario(scenario, baseline, sourceLabel, ["Cash Flow", "Obligations", "Goals", "Debt", "Emergency Preparedness", "Intentional Progress"], "Extra income rule improves cushion and opens optional allocation paths."),
      };
    }

    return {
      ...base,
      statusImpact: {
        label: "Status impact",
        value: STATUS.AHEAD,
        detail: `Skipping ${scenario.amountLabel} of spending would improve short-term cash flow. Baseline cushion is ${cushion}.`,
        tone: "green",
      },
      billsImpact: {
        label: "Bills impact",
        value: "More room",
        detail: "Bills have more breathing room because less cash leaves the plan.",
        tone: "green",
      },
      goalImpact: {
        label: "Goal impact",
        value: "Can improve",
        detail: `${scenario.target} could receive the freed-up cash.`,
        tone: "green",
      },
      debtImpact: {
        label: "Debt impact",
        value: "Optional",
        detail: "Debt progress can improve if the skipped expense is redirected.",
        tone: "blue",
      },
      emergencyFundImpact: {
        label: "Emergency fund impact",
        value: "Can improve",
        detail: "Preparedness improves if the avoided expense is kept in reserve.",
        tone: "green",
      },
      tradeoffs: [
        "This would improve cash flow without requiring new income.",
        "This option may fit if the skipped expense still supports your priorities.",
        "Choose the path that fits your priorities.",
      ],
      educationalInsight:
        "Skipping an expense is most useful when the freed-up cash has a clear purpose. Ahead connects the avoided spending to the next priority.",
      debug: debugForScenario(scenario, baseline, sourceLabel, ["Cash Flow", "Goals", "Debt", "Emergency Preparedness", "Intentional Progress"], "Skipped expense rule increases available cushion and creates optional allocation room."),
    };
  }

  function debugForScenario(scenario, baseline, sourceLabel, pillarsTriggered, statusReason) {
    return {
      placeholderInputs: [
        `Baseline source: ${sourceLabel}`,
        `Baseline cushion: ${currency(baseline.availableCushion || 0)}`,
        `Upcoming bills: ${currency(baseline.upcomingBills || 0)}`,
        `Goal progress: ${baseline.goalProgress || 0}%`,
        `Debt balance: ${currency(baseline.debtBalance || 0)}`,
        `Scenario type: ${scenario.typeLabel}`,
        `Amount: ${scenario.amountLabel}`,
        `Target: ${scenario.target}`,
        `Timing: ${scenario.timing === "custom" && scenario.customDate ? scenario.customDate : scenario.timingLabel}`,
      ],
      pillarsTriggered,
      statusReason,
      futureReplacement:
        "Future logic will replace this deterministic rule with real cash-flow timing, bill coverage, category plans, goals, debt schedules, and user priority weighting.",
    };
  }

  function evaluateDecision(input = {}) {
    const scenarioId = input.scenarioId || "emergencyFundTransfer";
    return scenarioSummaries[scenarioId] || scenarioSummaries.emergencyFundTransfer;
  }

  function listDecisionScenarios() {
    return Object.values(scenarioSummaries);
  }

  function getDecisionFoundation() {
    return {
      purpose: "Ahead helps users understand the consequences of financial decisions before they make them.",
      statuses: Object.values(STATUS),
      statusInputs: STATUS_INPUTS,
      pillars: PILLARS,
    };
  }

  return {
    STATUS,
    PILLARS,
    STATUS_INPUTS,
    evaluateDecision,
    evaluateLiveScenario,
    listDecisionScenarios,
    getDecisionFoundation,
  };
})();

window.AheadDecisionEngine = AheadDecisionEngine;
