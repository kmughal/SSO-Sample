import React from "react";
import ReactDOM from "react-dom";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { App } from "./App";
import { authConfig } from "./auth";
 

const msalInstance = new PublicClientApplication(authConfig);
msalInstance.handleRedirectPromise().then((response) => {
  console.log("Authentication response:", response);
});

function Main() {
  return (
    <MsalProvider instance={msalInstance}>
      <div>
        <App />
      </div>
    </MsalProvider>
  );
}



ReactDOM.render(<Main />, document.getElementById("root"));
