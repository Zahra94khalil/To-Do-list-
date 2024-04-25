const todoList = document.getElementById("ToDoList");
const doneList = document.getElementById("DoneList");
const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const input = document.getElementById("taskUser");
const URL = " http://localhost:3000";

input.focus();

//  create task item (li) in Dom [Read] ===>
const getToDoTasks = async () => {
  const res = await fetch(URL + `/todo`);
  const data = await res.json();
  for (task of data) {
    todoList.innerHTML += `<li id=${task.id}>
    <span class="todoTask">${task.title}</span>
    <i class="fa-regular fa-pen-to-square editMark"></i>
    <i class="fa-solid fa-trash deleteMark"></i>
    <i class="fa-solid fa-check doneMark"></i>
</li>`;
  }
};

const getDoneTasks = async () => {
  const res = await fetch(URL + "/done");
  const doneTasks = await res.json();
  for (done of doneTasks) {
    doneList.innerHTML += `
      <li id=${done.id}>
      <span class="todoTask">${done.title}</span>
      <i class="fa-solid fa-arrows-rotate restoreMark"></i>
      <i class="fa-solid fa-trash deleteMark"></i>
  </li>
      `;
  }
};

//  add task item in Mock Server [Post] ===>
const addTodoTask = async (inputValue) => {
  const res = await fetch(URL + "/todo", {
    method: "POST",
    body: JSON.stringify({
      title: inputValue,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });
};

//  remove task item in Mock Server [Delete] ===>
const removeTodoTask = async (id) => {
  const res = await fetch(URL + `/todo/${id}`, {
    method: "DELETE",
  });
};

//  get single task title for edit title ===>
const getSingleToDoTask = async (id) => {
  editBtn.style.transform = "translateX(-48px)";
  const res = await fetch(URL + `/todo/${id}`);
  const data = await res.json();
  // editBtn.style.transform = "translate(-50px , 0)";
  input.value = data.title;
  input.focus();
};

//  edit task item in Mock Server [Patch] ===>
const editTasks = async (id) => {
  const updatedTask = {
    title: input.value,
  };

  if (input.value.trim()) {
    const res = await fetch(URL + `/todo/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedTask),
      headers: {
        "Content-type": "application/json",
      },
    });
    res.status === 200 ? alert("The task was edited") : null;
  }
};

const CreateDoneTasks = async (id, temperaryStorage) => {
  const temperaryTask = temperaryStorage;
  const SendTodoToDone = async (temperaryTask) => {
    const res = await fetch(URL + "/done", {
      method: "POST",
      body: JSON.stringify({
        title: temperaryTask,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (res.status === 201) {
      const res = await fetch(URL + `/todo/${id}`, {
        method: "DELETE",
      });
    }
  };
  SendTodoToDone(temperaryTask);
};

// Delete Done Task
const deleteDone = async (id) => {
  const res = await fetch(URL + `/done/${id}`, {
    method: "DELETE",
  });
};

const undoDone = async (id, temperaryStorage) => {
  const temperaryTask = temperaryStorage;
  const swapDoneToToDo = async (temperaryTask) => {
    const res = await fetch(URL + "/todo", {
      method: "POST",
      body: JSON.stringify({
        title: temperaryTask,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (res.status === 201) {
      const res = await fetch(URL + `/done/${id}`, {
        method: "DELETE",
      });
    }
  };
  swapDoneToToDo(temperaryTask);
};

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// All Event Listeners =====>

// event listener add task (Enter Key) ===>
input.addEventListener("keyup", function (e) {
  if (e.key == "Enter") {
    inputValue = input.value.trim();

    if (inputValue) {
      addTodoTask(inputValue);
      input.value = "";
      input.focus();
    } else {
      alert("Please Write Some Words!!");
    }
  }
});

// event listener add task (add btn click) ===>
addBtn.addEventListener("click", function (e) {
  inputValue = input.value.trim();

  if (inputValue) {
    addTodoTask(inputValue);
    input.value = "";
    input.focus();
  } else {
    alert("Please Write Some Words!!");
  }
});

// event listener delete task (remove btn click) ===>
todoList.addEventListener("click", function (e) {
  const id = e.target.parentElement.id;

  if (e.target.classList.contains("deleteMark")) {
    const deleteConfirm = confirm("Are You Sure Delete This Task?");
    deleteConfirm ? removeTodoTask(id) : null;
  }
  // event listener delete task (remove btn click) ===>
  if (e.target.classList.contains("editMark")) {
    const editConfirm = confirm("Are You Sure Edit This Task?");
    if (editConfirm) {
      addBtn.style.transform = "translateX(48px)";
      editBtn.style.transform = "translateX(-48px)";

      getSingleToDoTask(id);
      editBtn.id = id;
    }
  }
  // move Task to Dones List
  if (e.target.classList.contains("doneMark")) {
    e.target.parentElement.style.transform = "translateX(110%)";
    const address = URL + `/todo/${id}`;
    const getSingleTodoData = async (address) => {
      const res = await fetch(address);
      const singleDone = await res.json();
      let temperaryStorage = singleDone.title;
      setTimeout(() => CreateDoneTasks(id, temperaryStorage), 400);
    };
    getSingleTodoData(address);
  }
});

doneList.addEventListener("click", function (e) {
  const id = e.target.parentElement.id;
  // return Done Task to Todo Task ==>
  if (e.target.classList.contains("restoreMark")) {
    const returnConfirmation = confirm("Are You Sure This?");

    if (returnConfirmation) {
      e.target.parentElement.style.transform = "translateX(-110%)";
      const address = URL + `/done/${id}`;
      const getSingleDoneData = async (address) => {
        const res = await fetch(address);
        const singleDone = await res.json();
        let temperaryStorage = singleDone.title;
        setTimeout(() => undoDone(id, temperaryStorage), 400);
      };
      getSingleDoneData(address);
    }
  }

  // Delete Done Task ===>
  if (e.target.classList.contains("deleteMark")) {
    const deleteConfirm = confirm("Are You Sure Delete This Task?");
    if (deleteConfirm) {
      deleteDone(id);
    }
  }
});

editBtn.addEventListener("click", function () {
  editTasks(this.id);
});

getToDoTasks();
getDoneTasks();
