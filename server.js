const express = require("express");
var cookieSession = require("cookie-session");

const fetch = require("node-fetch");

// our module
const moduleToFetch = require("./getNotion");

// const database = require("./getFirebase");
var admin = require("firebase-admin");
require("dotenv").config();

// grab the firebase credentials from an environment variable
// the environment variable is a base64 encoded ServiceAccount object
let theCreds = admin.credential.cert(
  JSON.parse(
    Buffer.from(process.env.FIREBASE_CONFIG, "base64").toString("utf-8")
  )
);

admin.initializeApp({
  credential: theCreds,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

let database = admin.database();

// user module (get token and data)

// our function

const nunjucks = require("nunjucks");

const getDatabase = moduleToFetch.getDatabase;

const port = 8000;

let redirect_uri = "";

if (process.env.NODE_ENV == "development") {
  redirect_uri = "http://localhost:8000/auth_callback";
} else {
  // a DOMAIN env var is required for production
  redirect_uri = process.env.DOMAIN + "/auth_callback";
}

const app = express();

app.use(express.static("public"));

// necessary to set session cookies
app.use(
  cookieSession({
    name: "session",
    keys: ["token"],

    // Cookie Options
    maxAge: 720 * 60 * 60 * 1000, // 1 month
  })
);

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.get("/users", async (req, res) => {
  const users = await getDatabase();
  res.json(users);
});

app.get("/", async (req, res) => {
  res.render("pages/landing.nj", { foo: "bar" });
});

app.get("/onboarding", async (req, res) => {
  res.render("pages/onboarding.nj", { foo: "bar" });
});

app.get("/auth", async (req, res) => {
  if (req.session.access_token) {
    // if the user is already logged in
    res.redirect("/settings");
    return;
  }

  // generate the "log in with Notion link"
  // docs: https://developers.notion.com/docs/authorization#prompting-users-to-add-an-integration

  const notion_link = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code`;

  res.render("pages/auth.nj", { foo: "bar", notion_link });
});

app.get("/auth_callback", async (req, res) => {
  // we have a temporary code (req.query.code), but we need to get an
  // access token

  const authorization = `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`;

  // // base64 encode it lol
  const auth_base64 = Buffer.from(authorization).toString("base64");

  const access_token = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth_base64}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: "http://localhost:8000/auth_callback",
    }),
  });

  let userData = await access_token.json();

  // add this user to database, if it doesn't exist
  try {
    // look up the user based on their access_token
    const ref = database.ref(`/users/${userData.access_token}`);
    const response = await ref.once("value");
    const user = response.val();

    if (!user) {
      // add the user to the database
      await ref.set({ notionData: userData, dashboardPages: [] });
    }

    // set a cookie with their access token so they don't need to log in again
    req.session.access_token = userData.access_token;
  } catch (err) {
    console.error(err);
    res.send("An error occurred", err);
    return;
  }

  // take them to the settings page
  res.redirect("/settings");
});

app.listen(port, console.log(`Server started on ${port}`));
