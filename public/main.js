const container = document.getElementById("container");
const barcontainer = document.getElementById("barcontainer");

const getDataFromBackend = async () => {
  const rest = await fetch("/users");
  const data = await rest.json();
  return data;
};

const makeChart = (data, chartTitleText) => {
  var chart = anychart.pie();
  chart.labels(false);

  var legend = chart.legend();
  legend.enabled(true);
  legend.align("left");
  legend.position("right");
  legend.itemsLayout("vertical");
  legend.height("100%");
  legend.width("50%");
  legend.padding("20%");

  var title = chart.legend().title();
  title.useHtml(true);
  title.enabled(true);
  title.text("Tasks");
  // set font size and align
  title.fontSize(20);
  title.align("left");

  // enable and configure the title separator
  var separator = chart.legend().titleSeparator();
  separator.enabled(true);
  separator.height(4);
  separator.fill("none");
  separator.stroke("#96a6a6", 1);

  // tune legend tooltip content appearance
  var tooltip = chart.tooltip();
  tooltip.useHtml(true);
  tooltip.enabled(true);
  tooltip.format("");

  // set the chart title
  var chartTitle = chart.title();
  chartTitle.enabled(true);
  chartTitle.text(chartTitleText);
  chartTitle.fontSize(30);
  chartTitle.fontDecoration("underline");

  // add the data
  chart.data(data);

  // create container
  const chartContainer = document.createElement("div");
  chartContainer.classList.add("container");
  container.appendChild(chartContainer);

  // display the chart in the container
  chart.container(chartContainer);
  chart.draw();
};

const makeBar = (color, value, title) => {
  barcontainer.innerHTML +=
    "<div class='titleandbar'><h1>" +
    title +
    "</h1>" +
    "<div class='progress' style='height: 75px'><div class='progress-bar' role='progressbar' aria-valuenow='" +
    value +
    "' aria-valuemin='0' aria-valuemax='100' style='max-width: " +
    value +
    "%;background-color:" +
    color +
    "'> <span class='title'>" +
    value +
    "%</span></div> </div> </div>";
};

const doEverything = async () => {
  const database = await getDataFromBackend();

  var sortDatabaseCategory = [];
  var sortDatabaseEpic = [];

  database.taskResults.forEach((element) => {
    var makeEpicKey = element.epicID[0].id;
    if (!sortDatabaseEpic[makeEpicKey]) {
      sortDatabaseEpic[makeEpicKey] = [];
    }

    var epicName = "";
    var epicColor = "";
    var bar = false;
    var pie = false;

    database.epicResults.forEach((epic) => {
      if (epic.epicId == makeEpicKey) {
        epicName = epic.epic;
        bar = epic.bar;
        pie = epic.pie;
        epicColor = epic.color;
      }
    });

    sortDatabaseEpic[makeEpicKey].push({
      task: element.task,
      category: element.category,
      completed: element.completed,
      enddate: element.enddate,
      epic: epicName,
      color: epicColor,
      bar: bar,
      pie: pie,
    });
  });

  const epicKeys = Object.keys(sortDatabaseEpic);

  epicKeys.forEach((key) => {
    let items = sortDatabaseEpic[key];
    var dataUndone = [];
    var dataCompleted = [];
    let chartTitleText = items[0].epic + " Tasks";
    var completedCount = 0;
    var totalCount = items.length;
    var color = items[0].color;

    items.forEach((item) => {
      if (item.completed == true) {
        completedCount += 1;
        dataCompleted.push({ x: item.task, value: 1, fill: color });
      } else {
        dataUndone.push({
          x: item.task,
          value: 1,
          fill: anychart.color.lighten(color),
        });
      }
    });

    var data = dataUndone.concat(dataCompleted);
    var value = Math.round((completedCount / totalCount) * 100);

    if (items[0].bar == true) {
      makeBar(color, value.toString(), chartTitleText);
    }
    if (items[0].pie == true) {
      anychart.onDocumentReady(function () {
        makeChart(data, chartTitleText);
      });
    }
  });
};

doEverything();
