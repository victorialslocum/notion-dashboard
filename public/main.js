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
            
        var sortDatabase = [];

        database.forEach((element) => {
            var makeKey = element.category;
            if(!sortDatabase[makeKey]) {
            sortDatabase[makeKey] = [];
            }
        
            sortDatabase[makeKey].push({
                task: element.task,
                category: element.category,
                completed: element.completed,
                enddate: element.enddate,
            });
        });

        console.log(sortDatabase);
        console.log(sortDatabase.School);

        const keys = Object.keys(sortDatabase)


        keys.forEach((key) => {
            let items = sortDatabase[key]
            var dataUndone = [];
            var dataCompleted = [];
            let chartTitleText = key + " Tasks"

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
            legend.align("center")
            legend.position("right")
            legend.itemsLayout("vertical")
            legend.height("100%")
            legend.width("50%")
            legend.padding("20%")

            var title = chart.legend().title();
            title.useHtml(true);
            title.enabled(true);
            title.text("Tasks" + "<br><a style=\"color:#0000FF; font-size: 10px;\">");
            // set font size and align
            title.fontSize(14);
            title.hAlign("center");

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