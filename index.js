// this will allow us to import our variable
require("dotenv").config();
// the following lines are required to initialize a Notion client
const { Client } = require("@notionhq/client");
// this line initializes the Notion Client using our key
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_API_DATABASE

const getDatabase = async () => {
  const response = await notion.databases.query({ database_id: databaseId });

  const responseResults = response.results.map((page) => {
    return {
      id: page.id,
      task: page.properties.Task.title[0]?.plain_text,
      completed: page.properties.Completed.checkbox,
    };
  });

  return responseResults;
};

var database = getDatabase();

const doEverything = async () => {

  const getDatabaseResult = await getDatabase()
  countComplete(getDatabaseResult)

}

doEverything()

countComplete = (result) => {
  console.log(result)

  var completedCount = 0;

  result.forEach((item) => {
    if (item.completed == true) {
      console.log(item)
      completedCount += 1
    }
  })


  console.log(completedCount);
  return completedCount;
}

countComplete();


// var container = document.getElementById("container");

// anychart.onDocumentReady(function () {

//     // set the data
//     var data = [
//         {x: "White", value: 223553265},
//         {x: "Black or African American", value: 38929319},
//         {x: "American Indian and Alaska Native", value: 2932248},
//         {x: "Asian", value: 14674252},
//         {x: "Native Hawaiian and Other Pacific Islander", value: 540013},
//         {x: "Some Other Race", value: 19107368},
//         {x: "Two or More Races", value: 9009073}
//     ];
  
//     // create the chart
//     var chart = anychart.pie();
  
//     // set the chart title
//     chart.title("Population by Race for the United States: 2010 Census");
  
//     // add the data
//     chart.data(data);
  
//     // display the chart in the container
//     chart.container(container);
//     chart.draw();
  
// });