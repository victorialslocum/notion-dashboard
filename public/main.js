const container = document.getElementById("container");

const getDataFromBackend = async () => {
    const rest = await fetch("http://localhost:8000/users");
    const data = await rest.json();

    console.log(data)
    return data;
};

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + "-" + mm + "-" + dd;

const doEverything = async () => {

    const database = await getDataFromBackend()

    console.log(database)

    anychart.onDocumentReady(function () {
            
        var sortDatabaseCategory = [];
        var sortDatabaseEpic = [];

        database.taskResults.forEach((element) => {
            var makeKey = element.category;
            if(!sortDatabaseCategory[makeKey]) {
            sortDatabaseCategory[makeKey] = [];
            }
        
            sortDatabaseCategory[makeKey].push({
                task: element.task,
                category: element.category,
                completed: element.completed,
                enddate: element.enddate,
                epicID: element.epicID[0].id
            });

            var makeKey = element.epicID[0].id;
            if(!sortDatabaseEpic[makeKey]) {
            sortDatabaseEpic[makeKey] = [];
            }
        
            var epicName = ""

            database.epicResults.forEach((epic) => {
                if (epic.epicId == makeKey) {
                    epicName = epic.epic
                } 
            })

            sortDatabaseEpic[makeKey].push({
                task: element.task,
                category: element.category,
                completed: element.completed,
                enddate: element.enddate,
                epic: epicName
            });
        });

        console.log(sortDatabaseCategory)
        console.log(sortDatabaseEpic)

        const catKeys = Object.keys(sortDatabaseCategory)

        const epicKeys = Object.keys(sortDatabaseEpic)


        catKeys.forEach((key) => {
            let items = sortDatabaseCategory[key]
            var dataUndone = [];
            var dataCompleted = [];
            let chartTitleText = key + " Tasks"

            console.log(items)

            items.forEach((item) => {
                // if (item.epicID == database.epicResults.epicId) {
                //     item.epicID = database.epicResults.epic
                // }
                if (item.enddate.start >= today || item.enddate.start == "2021-08-01") {
                    if (item.completed == true) {
                        dataCompleted.push({x: item.task, value: 1, fill: "#36abd9"})
                    } else {
                        dataUndone.push({x: item.task, value: 1, fill: anychart.color.lighten("#36abd9")})
                    }

                }
            })

            var data = dataUndone.concat(dataCompleted);

            var chart = anychart.pie();
            chart.labels(false);
        
            var legend = chart.legend();
            legend.enabled(true);
            legend.align("left")
            legend.position("right")
            legend.itemsLayout("vertical")
            legend.height("100%")
            legend.width("50%")
            legend.padding("20%")

            var title = chart.legend().title();
            title.useHtml(true);
            title.enabled(true);
            title.text("Tasks");
            // set font size and align
            title.fontSize(20);
            title.align("left");

            // enable and configure the title separator
            var separator = chart.legend().titleSeparator()
            separator.enabled(true);
            separator.height(4);
            separator.fill("none");
            separator.stroke("#96a6a6", 1);
            
            // tune legend tooltip content appearance
            var tooltip = chart.tooltip();
            tooltip.useHtml(true);
            tooltip.enabled(true);
            tooltip.format("")
        
            // set the chart title
            var chartTitle = chart.title();
            chartTitle.enabled(true);
            chartTitle.text(chartTitleText)
            chartTitle.fontSize(30)
            chartTitle.fontDecoration("underline")
        
            // add the data
            chart.data(data);
        
            // create container
            const chartContainer = document.createElement("div")
            chartContainer.classList.add("container")
            container.appendChild(chartContainer)   

            // display the chart in the container
            chart.container(chartContainer);
            chart.draw();

        });

        epicKeys.forEach((key) => {
            let items = sortDatabaseEpic[key]
            var dataUndone = [];
            var dataCompleted = [];
            let chartTitleText =  items[0].epic + " Tasks";

            console.log(items)

            items.forEach((item) => {
                if (item.enddate.start >= today || item.enddate.start == "2021-08-01") {
                    if (item.completed == true) {
                        dataCompleted.push({x: item.task, value: 1, fill: "#36abd9"})
                    } else {
                        dataUndone.push({x: item.task, value: 1, fill: anychart.color.lighten("#36abd9")})
                    }

                }
            })

            var data = dataUndone.concat(dataCompleted);

            var chart = anychart.pie();
            chart.labels(false);
        
            var legend = chart.legend();
            legend.enabled(true);
            legend.align("left")
            legend.position("right")
            legend.itemsLayout("vertical")
            legend.height("100%")
            legend.width("50%")
            legend.padding("20%")

            var title = chart.legend().title();
            title.useHtml(true);
            title.enabled(true);
            title.text("Tasks");
            // set font size and align
            title.fontSize(20);
            title.align("left");

            // enable and configure the title separator
            var separator = chart.legend().titleSeparator()
            separator.enabled(true);
            separator.height(4);
            separator.fill("none");
            separator.stroke("#96a6a6", 1);
            
            // tune legend tooltip content appearance
            var tooltip = chart.tooltip();
            tooltip.useHtml(true);
            tooltip.enabled(true);
            tooltip.format("")
        
            // set the chart title
            var chartTitle = chart.title();
            chartTitle.enabled(true);
            chartTitle.text(chartTitleText)
            chartTitle.fontSize(30)
            chartTitle.fontDecoration("underline")
        
            // add the data
            chart.data(data);
        
            // create container
            const chartContainer = document.createElement("div")
            chartContainer.classList.add("container")
            container.appendChild(chartContainer)   

            // display the chart in the container
            chart.container(chartContainer);
            chart.draw();

        });
    
    });
 
}

doEverything();