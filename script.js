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
const bool = await fs.exists(wn.path.file("Documents", "Todos", "todo.json"))

// If the file doesn't exist, create it
if (!bool) {
  alert("no file");
}

// If the file does exist, read it
if (bool) {
  alert("file exists");
}


// Draw the todos to the screen