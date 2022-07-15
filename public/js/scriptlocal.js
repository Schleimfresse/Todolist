window.onload = getTodo();
visiblepref = false;
invalid_item = document.getElementById("invalid");
function invalid(message) {
  invalid_item.textContent = message;
  invalid_item.style.opacity = 1;
  setTimeout(() => {
    invalid_item.style.opacity = 0;
  }, 3000);
}

function getTodo() {
  if (localStorage.getItem("tasks") == null) return;
  let todos = Array.from(JSON.parse(localStorage.getItem("tasks")));
  todos.forEach((task) => {
    if (task.number == "" || task.number == "none") {
      numberselectItem = "";
      number_para = "'none',";
    } else {
      numberselectItem = `<span class="numberselectITEM">
      <span>${task.number}</span><span class="numberselectSUFFIX">${suffixpref}</span>
      </span>`;
      number_para = "this.parentElement.children[1].children[0].textContent,";
    }
    const ulist = document.querySelector("ul");
    const li = document.createElement("li");
    li.setAttribute("id", `${task.task}`);
    li.setAttribute("class", "todofield_item");
    if (numberselectItem !== "") {
      numberindex = 2;
    } else {
      numberindex = 1;
    }
    li.innerHTML = `
    <div class="TODO-Item-content ${task.deactivated ? "deactivated" : ""}">
     <span id="bookmark" onclick="taskComplete(this, ${numberindex})">
    <ion-icon name="bookmark"></ion-icon>
    </span>
    ${numberselectItem}
    <span class="todofield_item_value">${task.task}</span>
    </div>
    <span class="checkbox">
    <input 
    onclick="
    this.parentElement.parentElement.classList.add('transition');
    setTimeout(() => { 
    removetodo(this);
    }, 900);" type='checkbox' id='checkbox'>
    </span>
    `;
    ulist.insertBefore(li, ulist.children[0]);
  });
}
function removetodo(event) {
  let todos = Array.from(JSON.parse(localStorage.getItem("tasks")));
  todos.forEach((task) => {
    if (task.task === event.parentElement.parentElement.id) {
      todos.splice(todos.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(todos));
  event.parentElement.parentElement.remove();
}

function taskComplete(event, childnumber) {
  let todos = Array.from(JSON.parse(localStorage.getItem("tasks")));
  todos.forEach((task) => {
    if (task.task === event.parentElement.children[childnumber].textContent) {
      task.deactivated = !task.deactivated;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(todos));
  event.parentElement.classList.toggle("deactivated");
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
    task = document.getElementById('todofield');
  } else {
    value = todofieldmobile.value;
    task = document.getElementById('todofieldmobile');
  }
  console.log("Value (newest input): ", value);
  if (value === "") {
    invalid("Invalid (Cannot have an empty entry)");
    return false;
  }
  if (document.querySelector(`input[value="${task.value}"]`)) {
    invalid("Todo already exist");
    return false;
  } else {
    if (task.value === "") {
      invalid("Invalid (Cannot have an empty entry)", "red");
    } else {
      if (numberselectItem !== "") {
        numberindex = 2;
      } else {
        numberindex = 1;
      }
      const Item = `<li class='todofield_item' id='${value}'>
      <div class="TODO-Item-content">
       <span id="bookmark" onclick="taskComplete(this, ${numberindex})">
      <ion-icon name="bookmark"></ion-icon>
      </span>
      ${numberselectItem}
      <span class="todofield_item_value">${value}</span>
      </div>
      <span class="checkbox">
      <input 
      onclick="
      this.parentElement.parentElement.classList.add('transition');
      setTimeout(() => { 
      removetodo(this);
      }, 900);" type='checkbox' id='checkbox'>
      </span>
      </li>`;
      todolist.innerHTML += Item;
      localStorage.setItem(
        "tasks",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("tasks") || "[]"),
          { task: value, number: number, deactivated: false },
        ])
      );
    }
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
