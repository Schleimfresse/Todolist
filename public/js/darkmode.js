BUTTON = document.getElementById("darkmode-bt");
if (localStorage.getItem("mode") == null) {
  document.querySelector("body").classList.add("dark");
  BUTTON.innerHTML = '<ion-icon class="icon-size-right" name="moon-outline"></ion-icon>';
} else {
  document.querySelector("body").classList.add(localStorage.getItem("mode"));
  BUTTON.innerHTML = localStorage.getItem("moon-pref");
}

if (localStorage.getItem("mode") == "light") {
  var DARKMODE = true;
} else {
  var DARKMODE = false;
}

const setClassToBody = () => {
  console.log(DARKMODE);
  if (DARKMODE) {
    document.querySelector("body").classList.remove("light");
    document.querySelector("body").classList.add("dark");
    localStorage.setItem("mode", "dark");
    BUTTON.innerHTML = '<ion-icon class="icon-size-right" name="moon-outline"></ion-icon>';
    localStorage.setItem(
      "moon-pref",
      '<ion-icon class="icon-size-right" name="moon-outline"></ion-icon>'
    );
    DARKMODE = false;
  } else {
    document.querySelector("body").classList.remove("dark");
    document.querySelector("body").classList.add("light");
    localStorage.setItem("mode", "light");
    BUTTON.innerHTML = '<ion-icon class="icon-size-right" name="moon"></ion-icon>';
    localStorage.setItem(
      "moon-pref",
      '<ion-icon class="icon-size-right" name="moon"></ion-icon>'
    );
    DARKMODE = true;
  }
};
BUTTON.addEventListener("click", setClassToBody);
