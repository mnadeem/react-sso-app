import React from "react";

import "./App.css";
import { AuthContext, AuthProvider } from "../../providers/AuthProvider";
import { Content } from "../Content/Content";

function App() {
  return (
    <AuthProvider>
      <AuthContext.Consumer>
        {authContext => (
          <div className="App">
            <Content key={"app-1"} authContext={authContext} />
          </div>
        )}
      </AuthContext.Consumer>
    </AuthProvider>
  );
}

export default App;
