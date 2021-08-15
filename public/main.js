const container = document.getElementById("container");

const getDataFromBackend = async () => {
    const rest = await fetch("http://localhost:8000/users");
    const data = await rest.json();
  
    return data;
  };
  
// Note that top-level await is only available in modern browsers
// https://caniuse.com/mdn-javascript_operators_await_top_level
  
const doEverything = async () => {

    const database = await getDataFromBackend()

    anychart.onDocumentLoad(function () {

        console.log(database)
    
        // set the data
        var data = [];
    
        database.forEach((item) => {
            if (item.completed == true) {
            data.append({x: item.task, value: 1, fill: "#069CCD"})
            } else {
            data.append({x: item.task, value: 1, fill: "#7BB9E7"})
            }
        })
    
        // create the chart
        var chart = anychart.pie();
    
        // set the chart color
    
        // set the chart title
        chart.title("Notion tasks");
    
        // add the data
        chart.data(data);
    
        // display the chart in the container
        chart.container(container);
        chart.draw();
    
    });
 
}

doEverything();