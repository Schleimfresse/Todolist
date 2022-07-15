suffixpref = localStorage.getItem("preference");
if (suffixpref === null) {
  x();
}
function active_suffix(event) {
  const checkboxes = document.querySelectorAll(".checkbox_suffix");
  checkboxes.forEach((checkbox) => {
    checkbox.classList.remove("checkbox_suffix_active");
  });
  event.classList.add("checkbox_suffix_active");
}

function change_suffix() {
  const numbers = document.querySelectorAll(".numberselectSUFFIX");
  numbers.forEach((number) => {
    number.textContent = suffixpref;
  });
}

function x() {
  suffixpref = "x";
  localStorage.setItem("preference", "x");
  change_suffix();
}

function punkt() {
  suffixpref = ".";
  localStorage.setItem("preference", ".");
  change_suffix();
}

function keins() {
  suffixpref = "";
  localStorage.setItem("preference", "");
  change_suffix();
}
function mal() {
  suffixpref = " Times";
  localStorage.setItem("preference", " Times");
  change_suffix();
}

document.addEventListener("DOMContentLoaded", function () {
  function setPreferenceOnload() {
    if (suffixpref === "x") {
      document.getElementById("x").classList.add("checkbox_suffix_active");
    } else if (suffixpref === ".") {
      document.getElementById("punkt").classList.add("checkbox_suffix_active");
    } else if (suffixpref === "") {
      document.getElementById("keins").classList.add("checkbox_suffix_active");
    } else if (suffixpref === " Times") {
      document.getElementById("mal").classList.add("checkbox_suffix_active");
    } else {
      localStorage.setItem("preference", "x");
    }
  }
  setPreferenceOnload();
});
