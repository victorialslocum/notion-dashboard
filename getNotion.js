// this will allow us to import our variable
require("dotenv").config();
// the following lines are required to initialize a Notion client

exports.getDatabase = async function (notion_token, epics_db_id, tasks_db_id) {
  // this line initializes the Notion Client using our key
  const { Client } = require("@notionhq/client");
  const notion = new Client({ auth: notion_token });

  const responseTask = await notion.databases.query({
    database_id: tasks_db_id,
  });
  const responseEpic = await notion.databases.query({
    database_id: epics_db_id,
  });

  const taskResponseResults = responseTask.results.map((page) => {
    return {
      id: page.id,
      task: page.properties.Task.title[0]?.plain_text,
      completed: page.properties.Completed.checkbox,
      enddate: page.properties.Due
        ? page.properties.Due.date
        : new Date("2021-08-01"),
      epicID: page.properties.Goal.relation,
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
