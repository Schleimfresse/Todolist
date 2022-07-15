getTodo();
getdeactivatedTodo();
let socket = io();
var delay = 3000;
var lastClick = 0;
const todolist = document.getElementById("todolist");
const invalid_item = document.getElementById("invalid");
function invalid(message, type) {
  invalid_item.textContent = message;
  invalid_item.style.color = type;
  invalid_item.style.opacity = 1;
  setTimeout(() => {
    invalid_item.style.opacity = 0;
  }, 3000);
}

async function getTodo() {
  const response = await fetch("/api");
  const data = await response.json();
  console.log("Items from Database 1:", data);
  for (item of data) {
    if (item.number == "") {
      numberselectItem = "";
      number_para = "";
    } else {
      numberselectItem = `<span class="numberselectITEM">
      <span>${item.number}</span><span class="numberselectSUFFIX">${suffixpref}</span>
      </span>`;
      number_para = "this.parentElement.children[1].children[0].textContent,";
    }
    const li = document.createElement("li");
    li.setAttribute("class", "todofield_item");
    li.setAttribute("id", `${item.value}`);
    const ul_container = document.getElementById("todolist");
    li.innerHTML = `<div class="TODO-Item-content">
    <span id="bookmark" onclick="MoveObjectsToSecondDb(${number_para}this.parentElement.parentElement.id,this);">
   <ion-icon name="bookmark"></ion-icon>
   </span>
   ${numberselectItem}
   <span class="todofield_item_value">${item.value}</span>
   </div>
   <span class="checkbox">
   <input 
   onclick="const THIS = this.parentElement.parentElement
   THIS.classList.add('transition');
   setTimeout(() => {
   THIS.remove();
   }, 900); removeFromDb(this.parentElement.parentElement.id, this.parentElement.parentElement.children[0].classList);" type='checkbox' id='checkbox'>
   </span>`;
    ul_container.appendChild(li);
  }
}

async function getdeactivatedTodo() {
  const response = await fetch("/api/deactivated");
  const data = await response.json();
  console.log("Items from Database 2:", data);
  for (item of data) {
    if (item.number == "") {
      numberselectItem = "";
      number_para = "0,";
    } else {
      numberselectItem = `<span class="numberselectITEM">
      <span>${item.number}</span><span class="numberselectSUFFIX">${suffixpref}</span>
      </span>`;
      number_para = "this.parentElement.children[1].children[0].textContent,";
    }
    const li = document.createElement("li");
    li.setAttribute("class", "todofield_item");
    li.setAttribute("id", `${item.value}`);
    const ul_container = document.getElementById("todolist");
    li.innerHTML = `<div class="TODO-Item-content deactivated">
    <span id="bookmark" onclick="MoveObjectsToSecondDb(${number_para}this.parentElement.parentElement.id,this);">
   <ion-icon name="bookmark"></ion-icon>
   </span>
   ${numberselectItem}
   <span class="todofield_item_value">${item.value}</span>
   </div>
   <span class="checkbox">
   <input 
   onclick="const THIS = this.parentElement.parentElement
   THIS.classList.add('transition');
   setTimeout(() => {
   THIS.remove();
   }, 900); removeFromDb(this.parentElement.parentElement.id, this.parentElement.parentElement.children[0].classList);" type='checkbox' id='checkbox'>
   </span>`;
    ul_container.appendChild(li);
  }
}

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  quantitydisable(true);
  addTodo(true);
});
document.getElementById("form-mobile").addEventListener("submit", (e) => {
  e.preventDefault();
  quantitydisable(false);
  addTodo(false);
});

function quantitydisable(event) {
  if (event) {
    let quantity_checkbox = document.getElementById("quantitycheck");
    if (quantity_checkbox.checked) {
      number = numberselect.value;
      numberselectItem = `<span class="numberselectITEM">
    <span>${number}</span><span class="numberselectSUFFIX">${suffixpref}</span>
    </span>`;
      number_para = "this.parentElement.children[1].children[0].textContent,";
    } else {
      number = "";
      numberselectItem = "";
      number_para = "'none',";
    }
  } else {
    let quantity_checkbox = document.getElementById("quantitycheck-mobile");
    if (quantity_checkbox.checked) {
      number = numberselectmobile.value;
      numberselectItem = `<span class="numberselectITEM">
    <span>${number}</span><span class="numberselectSUFFIX">${suffixpref}</span>
    </span>`;
      number_para = "this.parentElement.children[1].children[0].textContent,";
    } else {
      number = "";
      numberselectItem = "";
      number_para = "'none',";
    }
  }
}

function addTodo(event) {
  if (event) {
    value = todofield.value;
    todo = document.getElementById("todofield");
  } else {
    value = todofieldmobile.value;
    todo = document.getElementById("todofieldmobile");
  }
  console.log("Value (newest input): ", todo.value);
  if (todo.value === "") {
    invalid("Invalid (Cannot have an empty entry)", "red");
  } else {
    const Item = `<li class='todofield_item' id='${value}'>
<div class="TODO-Item-content">
 <span id="bookmark" onclick="MoveObjectsToSecondDb(${number_para}this.parentElement.parentElement.id,this);">
<ion-icon name="bookmark"></ion-icon>
</span>
${numberselectItem}
<span class="todofield_item_value">${value}</span>
</div>
<span class="checkbox">
<input 
onclick="const THIS = this.parentElement.parentElement
THIS.classList.add('transition');
setTimeout(() => {
THIS.remove();
}, 900); removeFromDb(this.parentElement.parentElement.id, this.parentElement.parentElement.children[0].classList);" type='checkbox' id='checkbox'>
</span>
</li>`;
    todolist.innerHTML += Item;
    syncWithDb(number, todo.value);
    broadcastTodo(Item);
  }
}
function MoveObjectsToSecondDb(number, value, event) {
  if (lastClick >= Date.now() - delay) {
    tippy(event, {
      content: "Whoa slow down",
      theme: "tomato",
      trigger: "click",
    });
    return;
  }
  lastClick = Date.now();
  if (event.parentElement.classList.contains("deactivated")) {
    let data = { value };
    console.log("item which has been removed from Database 2", data);
    const options = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    };
    fetch("/api/deactivated", options);

    let data2 = { value, number };
    console.log("data2-content:", data2);
    event.parentElement.classList.remove("deactivated");
    console.log("item which has been moved to Database 1:", event, data);
    const options2 = {
      method: "POST",
      body: JSON.stringify(data2),
      headers: {
        "Content-type": "application/json",
      },
    };
    fetch("/api", options2);
    socket.emit("todo-move", value);
  } else {
    let data = { value };
    console.log("item which has been removed from Database 1", data);
    const options = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    };
    fetch("/api", options);

    let data2 = { value, number };
    event.parentElement.classList.add("deactivated");
    console.log("item which has been moved to Database 2:", event, data);
    const options2 = {
      method: "POST",
      body: JSON.stringify(data2),
      headers: {
        "Content-type": "application/json",
      },
    };
    fetch("/api/deactivated", options2);
    socket.emit("todo-move", value);
  }
}

function syncWithDb(number, value) {
  const data = { value, number };
  console.log("item which has been inserted into Database 1", data);
  const options = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  };
  fetch("/api", options);
}

function broadcastTodo(Item) {
  // Socket
  socket.emit("todo-post", Item);
}

function removeFromDb(value, classes) {
  if (classes.contains("deactivated")) {
    data = { value };
    console.log("item which has been removed from Database 2", data);
    const options = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    };
    fetch("/api/deactivated", options);
    socket.emit("todo-remove", value);
  } else {
    data = { value };
    console.log("item which has been removed from Database 1", data);
    const options = {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    };
    fetch("/api", options);
    socket.emit("todo-remove", value);
  }
}

function expandmenu(obj1, obj2) {
  obj = document.getElementById(obj1);
  if (obj.classList.contains(obj2)) {
    obj.classList.remove(obj2);
  } else {
    obj.classList.add(obj2);
  }
}

$("body").on("click", "#mobile-menu", function () {
  document.getElementById("mobile-box").classList.toggle("show");
});
$("body").on("click", "#mobile-submit", function () {
  document.getElementById("mobile-box").classList.remove('show');
});

// Socket.io

todofield.addEventListener("keyup", (e) => {
  socket.emit("typing");
});
todofieldmobile.addEventListener("keyup", (e) => {
  socket.emit("typing");
});

socket.on("todo-post", (Item) => {
  todolist.innerHTML += Item;
  console.log(`[LOCAL]: a new item was received successfully`);
});

socket.on("todo-remove", (value) => {
  try {
    todolist.removeChild(document.getElementById(value));
    console.log(`[LOCAL]: a item was successfully removed`);
  } catch (err) {
    console.log(
      `[LOCAL]: an error occurred while trying to remove an item. [${err}]`
    );
  }
});

socket.on("todo-move", (value) => {
  obj = document.getElementById(value).children[0];
  try {
    if (obj.classList.contains("deactivated")) {
      obj.classList.remove("deactivated");
    } else {
      obj.classList.add("deactivated");
    }
    console.log(`[LOCAL]: an item was successfully edited`);
  } catch (err) {
    console.log(
      `[LOCAL]: an error occurred while trying to edit an item. [${err}]`
    );
  }
});

let timerId = null;
function debounce(func, timer) {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    func();
  }, timer);
}

let typingDiv = document.querySelector("#invalid");
socket.on("typing", () => {
  invalid("Someone is typing...", "rgb(0, 194, 0)");
  debounce(function () {
    typingDiv.innerText = "";
  }, 2500);
});
