// this will allow us to import our variable
require("dotenv").config();
// the following lines are required to initialize a Notion client
const { Client } = require("@notionhq/client");

// this line initializes the Notion Client using our key
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const taskDatabaseId = process.env.NOTION_API_DATABASE_TASK;
const epicDatabaseId = process.env.NOTION_API_DATABASE_EPIC;

exports.getDatabase = async function () {
  const responseTask = await notion.databases.query({
    database_id: taskDatabaseId,
  });
  const responseEpic = await notion.databases.query({
    database_id: epicDatabaseId,
  });

  const taskResponseResults = responseTask.results.map((page) => {
    return {
      id: page.id,
      task: page.properties.Task.title[0]?.plain_text,
      completed: page.properties.Completed.checkbox,
      enddate: page.properties.Due
        ? page.properties.Due.date
        : new Date("2021-08-01"),
      epicID: page.properties.Epics.relation,
    };
  });

  const epicResponseResults = responseEpic.results.map((page) => {
    return {
      epicId: page.id,
      epic: page.properties.Name.title[0]?.plain_text,
      date: page.properties.Date
        ? page.properties.Date.date
        : new Date("2021-08-01"),
      color: page.properties.Color.rich_text[0]
        ? page.properties.Color.rich_text[0].plain_text
        : "#36abd9",
      bar: page.properties.Bar.checkbox,
      pie: page.properties.Pie.checkbox,
    };
  });

  return {
    taskResults: taskResponseResults,
    epicResults: epicResponseResults,
  };
};
