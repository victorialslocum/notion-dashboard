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

        // set the data
        var dataPersonal = [];
        var dataDaily = [];
        var dataSchool = [];
    
        database.forEach((item) => {
            if (item.category == "Daily") {
                if (item.completed == true) {
                dataDaily.push({x: item.task, value: 1, fill: "#069CCD"})
                } else {
                dataDaily.push({x: item.task, value: 1, fill: "#7BB9E7"})
                }
            } else if (item.category == "School") {
                if (item.completed == true) {
                dataSchool.push({x: item.task, value: 1, fill: "#069CCD"})
                } else {
                dataSchool.push({x: item.task, value: 1, fill: "#7BB9E7"})
                }
            } else if (item.category == "Personal") {
                if (item.completed == true) {
                dataPersonal.push({x: item.task, value: 1, fill: "#069CCD"})
                } else {
                dataPersonal.push({x: item.task, value: 1, fill: "#7BB9E7"})
                }
            }
        })
    
        // create the chart
        var chartDaily = anychart.pie();
        
        chartDaily.legend(false);
    
        // set the chart title
        chartDaily.title("Daily Notion tasks");
    
        // add the data
        chartDaily.data(dataDaily);
    
        // display the chart in the container
        chartDaily.container(container1);
        chartDaily.draw();


        // create the chart
        var chartSchool = anychart.pie();
    
        chartSchool.legend(false);

        // set the chart title
        chartSchool.title("School Notion tasks");
    
        // add the data
        chartSchool.data(dataSchool);
    
        // display the chart in the container
        chartSchool.container(container2);
        chartSchool.draw();


        // create the chart
        var chartPersonal = anychart.pie();
    
        chartPersonal.legend(false);

        // set the chart title
        chartPersonal.title("Personal Notion tasks");
    
        // add the data
        chartPersonal.data(dataPersonal);
    
        // display the chart in the container
        chartPersonal.container(container3);
        chartPersonal.draw();
    
    });
 
}

doEverything();