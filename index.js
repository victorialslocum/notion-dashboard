// this will allow us to import our variable
require("dotenv").config();
// the following lines are required to initialize a Notion client
const { Client } = require("@notionhq/client");
// this line initializes the Notion Client using our key
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_API_DATABASE

exports.getDatabase = async function () {
  const response = await notion.databases.query({ database_id: databaseId });

  const responseResults = response.results.map((page) => {
    return {
      id: page.id,
      task: page.properties.Task.title[0]?.plain_text,
      completed: page.properties.Completed.checkbox,
      category: page.properties.Category.select.name,
      enddate: page.properties.Due.date,
      // epic: page.properties. ref: https://stackoverflow.com/questions/67913461/notion-querying-databases-and-pages-provide-limited-properties
    };
  });

  return responseResults;
};