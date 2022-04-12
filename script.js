const wn = self.webnative

const state = await wn.initialise({
  permissions: {
    // Will ask the user permission to store
    // your apps data in `private/Apps/Nullsoft/Winamp`
    app: {
      name: "Fission-Todo",
      creator: "Jess Martin"
    },

    // Ask the user permission to additional filesystem paths
    fs: {
      private: [wn.path.directory("Documents", "Todos")],
    }
  }
}).catch(err => {
  switch (err) {
    case wn.InitialisationError.InsecureContext:
    // We need a secure context to do cryptography
    // Usually this means we need HTTPS or localhost

    case wn.InitialisationError.UnsupportedBrowser:
    // Browser not supported.
    // Example: Firefox private mode can't use indexedDB.
  }
})

switch (state.scenario) {
  case wn.Scenario.AuthCancelled:
    // User was redirected to lobby,
    // but cancelled the authorisation
    break;

  case wn.Scenario.AuthSucceeded:
  case wn.Scenario.Continuation:
    // State:
    // state.authenticated    -  Will always be `true` in these scenarios
    // state.newUser          -  If the user is new to Fission
    // state.throughLobby     -  If the user authenticated through the lobby, or just came back.
    // state.username         -  The user's username.
    //
    // ☞ We can now interact with our file system (more on that later)
    state.fs
    break;

  case wn.Scenario.NotAuthorised:
    wn.redirectToLobby(state.permissions)
    break;
}

// Load all the todos from the file system
const fs = state.fs
// Check if the file exists
const bool = await fs.exists(wn.path.file("private", "Documents", "Todos", "todo.json"))

// If the file doesn't exist, create it
if (!bool) {
  const cid = await fs.write(
    wn.path.file("private", "Documents", "Todos", "todo.json"),
    '[{"title": "Build a thing", "checked": false, "todoId": "1"}]'
  )

  await fs.publish();
}

// If the file does exist, read it
if (bool) {
  const todoList = await fs.cat(
    wn.path.file("private", "Documents", "Todos", "todo.json")
  )

  const todoListJson = JSON.parse(todoList);

  // Add all the todo items
  Object.entries(todoListJson).forEach(([index, todo]) => {
    appendTodoElement(todo);
  });
}

// Draw the todos to the screen
function appendTodoElement({ title, todoId, checked }) {
  const todoElement = document.createElement("li");
  todoElement.id = todoId;
  if (checked) todoElement.className = "checked";

  todoElement.innerHTML = `
      <input type="checkbox" class="todoCheck" ${checked ? 'checked' : ''}>
      <span class="todoText">${title}</span>
      <input class="todoEdit" hidden="true">
    `;
  todoElement.querySelector(".todoEdit").value = title;
  document.getElementById("todoList").appendChild(todoElement);
}

function addTodo() {
  const title = document.getElementById("newTodo").value;
  if (!title) return;
  newTodo.value = "";
  appendTodoElement({ todoId: 1, title, checked: false });
}

function onKeyDown(event) {
  const newTodo = document.getElementById("newTodo");

  if (newTodo.focus && newTodo.value !== "" && event.code === "Enter") {
    addTodo();
  }
}

document.addEventListener('keydown', onKeyDown);
const addTodoButton = document.getElementById("addTodo");
addTodoButton.addEventListener('click', addTodo);