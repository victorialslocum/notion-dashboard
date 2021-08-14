// this will allow us to import our variable
require("dotenv").config();
// the following lines are required to initialize a Notion client
const { Client } = require("@notionhq/client");
// this line initializes the Notion Client using our key
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_API_DATABASE

const getDatabase = async () => {
    const response = await notion.databases.query({ database_id: databaseId });
  
    console.log(response);
  };
  
  getDatabase();

