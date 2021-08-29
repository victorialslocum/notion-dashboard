const express = require("express");
const fetch = require("node-fetch");

// our module
const moduleToFetch = require("./index");

// user module (get token and data)

// our function

const nunjucks = require("nunjucks");
const { restart } = require("nodemon");

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

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.get("/users", async (req, res) => {
  const users = await getDatabase();
  res.json(users);
});

app.get("/auth", async (req, res) => {
  // generate the "log in with Notion link"
  // docs: https://developers.notion.com/docs/authorization#prompting-users-to-add-an-integration

  const notion_link = `https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code`;

  res.render("pages/auth.nj", { foo: "bar", notion_link });
});

app.get("/auth_callback", async (req, res) => {
  // we have a temporary code (req.query.code), but we need to get an
  // access token

  const authorization = `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`;

  // base64 encode it lol
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

  console.log("what happened is", access_token);

  let victoriaIsProbablyRighht = await access_token.json();

  console.log(victoriaIsProbablyRighht);

  console.log(req.query.code);

  res.send(req.query);
});

app.listen(port, console.log(`Server started on ${port}`));
