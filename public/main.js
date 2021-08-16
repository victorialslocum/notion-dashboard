const container = document.getElementById("container");

const getDataFromBackend = async () => {
    const rest = await fetch("http://localhost:8000/users");
    const data = await rest.json();
    
    console.log(data)
    return data;
};


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
            var data = [];
            let chartTitle = key + " Notion Tasks"

            console.log(items)

            items.forEach((item) => {
                if (item.completed == true) {
                    data.push({x: item.task, value: 1, fill: "#069CCD"})
                } else {
                    data.push({x: item.task, value: 1, fill: "#7BB9E7"})
                }
        })
        
        var chart = anychart.pie();
    
        var legend = chart.legend();
        legend.enabled(true);
        legend.align("center")
        legend.position("right")
        legend.itemsLayout("vertical")
    
        // set the chart title
        chart.title(chartTitle);
    
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
            // https://stackoverflow.com/questions/40774697/how-to-group-an-array-of-objects-by-key

            // const groupCategory = _.groupBy(item, item.category));
            // console.log(groupCategory.get("School"));

            // item.forEach((category) => {
            //     console.log(item)
            //     var data = [];

            //     if (item.completed == true) {
            //         data.push({x: item.task, value: 1, fill: "#069CCD"})
            //     } else {
            //         data.push({x: item.task, value: 1, fill: "#7BB9E7"})
            //     }
                
            //     var chart = anychart.pie();
        
            //     chart.legend(false);
            
            //     // set the chart title
            //     chart.title("Daily Notion tasks");
            
            //     // add the data
            //     chart.data(data);
            
            //     // create container
            //     const chartContainer = document.createElement("div")
            //     chartContainer.classList.add("container")
            //     container.appendChild(chartContainer)   

            //     // display the chart in the container
            //     chart.container(chartContainer);
            //     chart.draw();
            // })

        // set the data
    //     var dataPersonal = [];
    //     var dataDaily = [];
    //     var dataSchool = [];
    
    //     database.forEach((item) => {
    //         if (item.category == "Daily") {
    //             if (item.completed == true) {
    //             dataDaily.push({x: item.task, value: 1, fill: "#069CCD"})
    //             } else {
    //             dataDaily.push({x: item.task, value: 1, fill: "#7BB9E7"})
    //             }
    //         } else if (item.category == "School") {
    //             if (item.completed == true) {
    //             dataSchool.push({x: item.task, value: 1, fill: "#069CCD"})
    //             } else {
    //             dataSchool.push({x: item.task, value: 1, fill: "#7BB9E7"})
    //             }
    //         } else if (item.category == "Personal") {
    //             if (item.completed == true) {
    //             dataPersonal.push({x: item.task, value: 1, fill: "#069CCD"})
    //             } else {
    //             dataPersonal.push({x: item.task, value: 1, fill: "#7BB9E7"})
    //             }
    //         }
    //     })
    
    //     // create the chart
    //     var chartDaily = anychart.pie();
        
    //     chartDaily.legend(false);
    
    //     // set the chart title
    //     chartDaily.title("Daily Notion tasks");
    
    //     // add the data
    //     chartDaily.data(dataDaily);
    
    //     // display the chart in the container
    //     chartDaily.container(container1);
    //     chartDaily.draw();


    //     // create the chart
    //     var chartSchool = anychart.pie();
    
    //     chartSchool.legend(false);

    //     // set the chart title
    //     chartSchool.title("School Notion tasks");
    
    //     // add the data
    //     chartSchool.data(dataSchool);
    
    //     // display the chart in the container
    //     chartSchool.container(container2);
    //     chartSchool.draw();


    //     // create the chart
    //     var chartPersonal = anychart.pie();
    
    //     chartPersonal.legend(false);

    //     // set the chart title
    //     chartPersonal.title("Personal Notion tasks");
    
    //     // add the data
    //     chartPersonal.data(dataPersonal);
    
    //     // display the chart in the container
    //     chartPersonal.container(container3);
    //     chartPersonal.draw();
    
    });
 
}

doEverything();