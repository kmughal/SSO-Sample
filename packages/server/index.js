require("dotenv").config();
const express = require("express");
const app = express();
const passport = require("passport");
const { BearerStrategy } = require("passport-azure-ad");
const morgan = require("morgan");
const axios = require("axios");

// ENV variables
const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const authority = process.env.AUTHORITY;
const policy = process.env.POLICY;
const scope = process.env.SCOPE;

const options = {
  identityMetadata: `https://${authority}/${tenantId}/${policy}/v2.0/.well-known/openid-configuration`,
  issuer: `https://${authority}/${tenantId}/v2.0/`,
  isB2C: true,
  policyName: policy,
  clientID: clientId,
  audience: clientId,
  validateIssuer: true,
  scope: [scope],
  tenantId,
  loggingLevel: "error",
  loggingNoPII: false,
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
  console.log("🚀 ~ bearerStrategy ~ token:", token);
  done(null, {}, token);
});

app.use(morgan("tiny"));

app.use(require("body-parser").urlencoded({ extended: true }));
app.use(passport.initialize());
passport.use("ssoBearer", bearerStrategy);

// Enable CORS for *
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get(
  "/api",
  passport.authenticate("ssoBearer", { session: false }),
  function (req, res) {
    const arr = Array.from({ length: 100 }, (_, i) => i + 1);
    res.json(arr).status(200);
  }
);

const withToken = async (func) => {
  const tokenResponse = await axios.post(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const token = tokenResponse.data.access_token;
  if (token) {
    func(token);
  }
};

const getAllUsers = async (token) => {
  const graphApiUrl = "https://graph.microsoft.com/v1.0/users";
  const graphResponse = await axios.get(graphApiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const users = graphResponse.data.value;
  return users;
};

app.get(
  "/users",
  passport.authenticate("ssoBearer", { session: false }),
  async function (req, res) {
    try {
      await withToken(async (token) => {
        const users = await getAllUsers(token);
        res.json(users).status(200);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Error fetching users" });
    }
  }
);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
