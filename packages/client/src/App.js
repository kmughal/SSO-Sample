import React, { useEffect, useState } from "react";
import { EventType } from "@azure/msal-browser";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

// variables
const scopes = [process.env.REACT_APP_SCOPES];
const apiUrl = process.env.REACT_APP_API_URL;

export function App() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [users, setUsers] = useState([]);

  const withAuth = async (fn) => {
    const account = instance.getActiveAccount();
    const tokenRequest = {
      scopes: scopes,
      account: account,
      authority: localStorage.getItem("authority"),
    };
    const response = await instance.acquireTokenSilent(tokenRequest);
    const token = response.accessToken;
    if (token) {
      fn(token);
    }
  };

  useEffect(() => {
    instance.addEventCallback((event) => {
      if (
        (event.eventType === EventType.LOGIN_SUCCESS ||
          event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS) &&
        event.payload.account
      ) {
        localStorage.setItem("accessToken", event.payload.account.idToken);
        localStorage.setItem("authority", event.payload.authority);
        instance.setActiveAccount(instance.getAllAccounts()?.[0]);
      }
    });
  }, []);

  const handleLogin = () => {
    // if you want to redirect to login page
    // instance.loginRedirect({
    //   scopes: [scopes],
    // });

    // logon pop up
    instance.loginPopup({
      scopes: scopes,
    });
  };

  const apiCallHandler = async () => {
    withAuth(async (token) => {
      const res = await fetch(apiUrl + "/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        console.log("Error", res.statusText);
      }
    });
  };

  return (
    <div className="container">
      {!isAuthenticated && <h1>SSO Not Completed</h1>}
      {isAuthenticated && (
        <h1>SSO Completed for {instance.getActiveAccount()?.name}</h1>
      )}
      <div>
        <button onClick={handleLogin} disabled={isAuthenticated}>
          Log In
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            instance.logout();
          }}
          disabled={!isAuthenticated}
        >
          Log out
        </button>
      </div>

      <button disabled={!isAuthenticated} onClick={apiCallHandler}>
        Get all users using MS Graph API
      </button>

      {users.length > 0 && (
        <section>
          <h2>Users : [{users.filter((x) => x.mail).length}]</h2>
          <table>
            <thead>
              <tr>
                <th>Display Name</th>
                <th>Mail</th>
                <th>User Principal Name</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((x) => x.mail)
                .map((user) => (
                  <UserInfo key={user.id} user={user} />
                ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function UserInfo({ user }) {
  return (
    <tr>
      <td>{user.displayName}</td>
      <td>{user.mail}</td>
      <td>{user.userPrincipalName}</td>
      <td>{user.id}</td>
    </tr>
  );
}
