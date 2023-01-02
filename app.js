window.location.hash = 0;
const fullName = document.querySelector(".fullName");
const email = document.querySelector(".email");
const phone = document.querySelector(".phone");
const btnNext = document.querySelectorAll(".next");
const inputs = document.querySelectorAll("input");
const btnBack = document.querySelectorAll(".btn_back");

const steps = [...document.querySelectorAll(".steps")];
const sidebarSteps = [...document.querySelectorAll(".circle")];

const renderStep = function (dire) {
  steps.forEach((step) => step.classList.add("hidden"));
  steps[dire].classList.toggle("hidden");
  sidebarSteps.forEach((step) => step.classList.remove("sidebarStep_active"));
  sidebarSteps[dire].classList.toggle("sidebarStep_active");
  window.location.hash = dire;
};

const showError = function (input) {
  renderStep(0);
  const markup = `<p class="invalidInput invalid${input.getAttribute(
    "class"
  )}">Invalid input</p>`;
  if (!input.classList.contains("badInput")) {
    input.classList.add("badInput");
    input.insertAdjacentHTML("beforebegin", markup);
  }
};

const nameValidation = function () {
  const regName = /^[a-zA-Z]+ [a-zA-Z]+$/;
  const name = fullName.value;
  if (!regName.test(name)) {
    showError(fullName);
    return false;
  }
  return true;
};

const emailValidation = function () {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (!email.value.match(validRegex)) {
    showError(email);
    return false;
  }
  return true;
};

const validatePhoneNumber = function () {
  const re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{3})$/;

  if (!re.test(phone.value)) {
    showError(phone);
    return false;
  }
  return true;
};

const finalValidation = function () {
  nameValidation();
  emailValidation();
  validatePhoneNumber();
  if (!nameValidation() || !emailValidation() || !validatePhoneNumber()) {
    return false;
  }
  return true;
};

const getHash = function () {
  return +window.location.hash.slice(1);
};

const renderChange = function (direction = false) {
  const id = getHash();
  const dire = direction ? id + 1 : id - 1;
  renderStep(dire);
};

btnNext.forEach((button) =>
  button.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(finalValidation());
    if (finalValidation()) {
      renderChange(button.classList.contains("next"));
    }
  })
);

btnBack.forEach((button) =>
  button.addEventListener("click", function (e) {
    e.preventDefault();
    renderChange();
  })
);

window.addEventListener("hashchange", function () {
  const id = getHash();
  if (!finalValidation()) {
    renderStep(0);
    return;
  }
  renderStep(id);
});

inputs.forEach((input) =>
  input.addEventListener("click", function () {
    const classes = input.getAttribute("class").split(" ")[0];
    if (input.classList.contains("badInput")) {
      document.querySelector(`.invalid${classes}`).remove();
      input.classList.remove("badInput");
    }
  })
);

const switchContainer = document.querySelector(".toggle");
const switchBtn = document.querySelector(".toggle_switch");
const monthly = document.querySelector(".toggle_monthly");
const yearly = document.querySelector(".toggle_yearly");
const plansText = document.querySelectorAll(".tile p");
const addons = document.querySelectorAll(".addon_mo");

switchContainer.addEventListener("click", () => {
  switchBtn.classList.toggle("toggle_switch_year");
  monthly.classList.toggle("--active");
  yearly.classList.toggle("--active");
  changeBilling(data.plans);
  changeBilling(data.addons);
  loadInitialData();
  loadFinalPlan();
  loadFinalAddons();
  renderFinalBill();
});

const data = {
  plans: [
    { name: "Arcade", amount: 9, shortBilling: "mo", selected: true },
    { name: "Advanced", amount: 12, shortBilling: "mo", selected: false },
    { name: "Pro", amount: 15, shortBilling: "mo", selected: false },
  ],
  addons: [
    { name: "Online service", amount: 1, shortBilling: "mo", selected: false },
    { name: "Local storage", amount: 2, shortBilling: "mo", selected: true },
    {
      name: "Customizable profile",
      amount: 2,
      shortBilling: "mo",
      selected: false,
    },
  ],
};
// console.log(data.plans.filter(item => item.selected))

const changeBilling = function (object) {
  object.forEach((plan) => {
    yearly.classList.contains("--active")
      ? (plan.amount *= 10)
      : (plan.amount /= 10);
    plan.shortBilling = yearly.classList.contains("--active")
      ? (plan.shortBilling = "yr")
      : (plan.shortBilling = "mo");
  });
};

const loadAmount = function (object, finalObject) {
  finalObject.forEach((plan, key) => {
    plan.innerHTML = `+$${object[key].amount}/${object[key].shortBilling}`;
    if (finalObject === plansText) {
      plan.innerHTML += yearly.classList.contains("--active")
        ? '<p class="freeMonths">2 months free</p>'
        : "";
    }
  });
};

const loadInitialData = function () {
  loadAmount(data.plans, plansText);
  loadAmount(data.addons, addons);
};

const init = function () {
  loadInitialData();
  loadFinalAddons();
};

const plansContainer = document.querySelector(".plans");
const tiles = document.querySelectorAll(".tile");
const optionsContainer = document.querySelector(".options");
const options = document.querySelectorAll(".option");

const selectPlan = function (plan) {
  data.plans.forEach((plan) => (plan.selected = false));
  data.plans.filter(
    (item) => item.name === plan.querySelector("h2").innerHTML
  )[0].selected = true;
  renderFinalBill();
};

const selectAddon = function () {
  options.forEach(
    (item, key) =>
      (data.addons[key].selected = item.classList.contains("option_active")
        ? true
        : false)
  );
  loadFinalAddons();
  renderFinalBill();
};

plansContainer.addEventListener("click", function (e) {
  tiles.forEach((tile) => tile.classList.remove("selected"));
  e.target.closest(".tile").classList.add("selected");
  selectPlan(e.target.closest(".tile"));
  loadFinalPlan();
});

optionsContainer.addEventListener("click", function (e) {
  e.target.closest(".option").classList.toggle("option_active");
  selectAddon();
});

const finalPlan = document.querySelector("h3");
const finalPlanAmount = document.querySelector(".plan_right");
const finalAddonsContainer = document.querySelector(".final_addons");

const loadFinalPlan = function () {
  const { name, amount, shortBilling } = data.plans.filter(
    (plan) => plan.selected
  )[0];
  finalPlan.innerText = `${name} (${
    data.plans[0].shortBilling === "mo" ? "Monthly" : "Yearly"
  })`;
  finalPlanAmount.innerHTML = `$${amount}/${shortBilling}`;
};

const loadFinalAddons = function () {
  finalAddonsContainer.innerHTML = "";
  const selectedAddons = data.addons.filter((addon) => addon.selected);
  selectedAddons.forEach((item) => {
    finalAddonsContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="addon">
        <span class="addonName">${item.name}</span>
        <span class="addonAmount">+$${item.amount}/${item.shortBilling}</span>
      </div>`
    );
  });
};
loadFinalAddons();

const calculateFinalBill = function (object) {
  return object
    .filter((addon) => addon.selected)
    .map((item) => item.amount)
    .reduce((acc, curr) => (acc += curr), 0);
};

const totalBillContainer = document.querySelector(".total");

const renderFinalBill = function () {
  const finalBill =
    calculateFinalBill(data.addons) + calculateFinalBill(data.plans);
  totalBillContainer.innerHTML = `
  <div class="totalPer">Total (per ${
    data.plans[0].shortBilling === "mo" ? "month" : "year"
  })</div>
  <div class="boldedTotal">+$${finalBill}/${data.plans[0].shortBilling}</div>
  `;
};
renderFinalBill();

const confirmBtn = document.querySelector(".btn_confirm");

confirmBtn.addEventListener("click", function () {
  steps.forEach((step) => step.classList.add("hidden"));
  steps[4].classList.toggle("hidden");
  sidebarSteps.forEach((step) => step.classList.remove("sidebarStep_active"));
  sidebarSteps[3].classList.toggle("sidebarStep_active");
});
