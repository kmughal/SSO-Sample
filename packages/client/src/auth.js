export const authConfig = {
    auth: {
      clientId: process.env.REACT_APP_CLIENT_ID,
      authority:
        process.env.REACT_APP_AUTHORITY,
      redirectUri: process.env.REACT_APP_REDIRECT_URI,
      postLogoutRedirectUri: "/",
      knownAuthorities: [process.env.REACT_APP_KNOWN_AUTHORITIES],
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true,
    },
    system: {
      loggerOptions: {
        loggerCallback(logLevel, message) {
          console.log({ message, logLevel });
        },
        piiLoggingEnabled: false,
        logLevel: 0,
      },
    },
  };