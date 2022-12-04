/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
// area charts about daily information
let myAreaChart0, myAreaChart1, myAreaChart2, myAreaChart3, myAreaChart4, myAreaChart5, myAreaChart6, myAreaChart7;
let myAreaChart8, myAreaChart9, myAreaChart10, myAreaChart11, myAreaChart12, myAreaChart13, myAreaChart14;

// name of the area charts
let charts = ['areaChart-0','areaChart-1', 'areaChart-2','areaChart-3', 'areaChart-4',
            'areaChart-5','areaChart-6', 'areaChart-7','areaChart-8', 'areaChart-9',
            'areaChart-10','areaChart-11', 'areaChart-12','areaChart-13', 'areaChart-14']

// area charts about monthly information
let myAreaChartMonth0, myAreaChartMonth1, myAreaChartMonth2, myAreaChartMonth3, myAreaChartMonth4, myAreaChartMonth5;
let myAreaChartMonth6, myAreaChartMonth7, myAreaChartMonth8, myAreaChartMonth9, myAreaChartMonth10, myAreaChartMonth11;
let myAreaChartMonth12, myAreaChartMonth13, myAreaChartMonth14;


// legend, tooltips, and buttons
let myAreaChartLegend;
let timeStamp_tooltip;
let climateZone_tooltip;
let button_chart_value = 'energy_total';

// title of each area chart describing the climate zone
const dataList = ['1A','2A','2B','3A','3B', '3C', '4A','4B','4C','5A', '5B','6A','6B', '7A','7B']
// displaying the number with one decimal place
const f = d3.format(".1f")

let selectedTimeRange = [];
let selectedState = '';


// load data using promises
let promises = [
    d3.csv("data/tot_min/f1a_tot_min.csv"),
    d3.csv("data/tot_min/f2a_tot_min.csv"),
    d3.csv("data/tot_min/f2b_tot_min.csv"),
    d3.csv("data/tot_min/f3a_tot_min.csv"),
    d3.csv("data/tot_min/f3b_tot_min.csv"),

    d3.csv("data/tot_min/f3c_tot_min.csv"),
    d3.csv("data/tot_min/f4a_tot_min.csv"),
    d3.csv("data/tot_min/f4b_tot_min.csv"),
    d3.csv("data/tot_min/f4c_tot_min.csv"),
    d3.csv("data/tot_min/f5a_tot_min.csv"),

    d3.csv("data/tot_min/f5b_tot_min.csv"),
    d3.csv("data/tot_min/f6a_tot_min.csv"),
    d3.csv("data/tot_min/f6b_tot_min.csv"),
    d3.csv("data/tot_min/f7a_tot_min.csv"),
    d3.csv("data/tot_min/f7b_tot_min.csv"),

    d3.csv("data/tot_month/f1a_tot_month.csv"),
    d3.csv("data/tot_month/f2a_tot_month.csv"),
    d3.csv("data/tot_month/f2b_tot_month.csv"),
    d3.csv("data/tot_month/f3a_tot_month.csv"),
    d3.csv("data/tot_month/f3b_tot_month.csv"),

    d3.csv("data/tot_month/f3c_tot_month.csv"),
    d3.csv("data/tot_month/f4a_tot_month.csv"),
    d3.csv("data/tot_month/f4b_tot_month.csv"),
    d3.csv("data/tot_month/f4c_tot_month.csv"),
    d3.csv("data/tot_month/f5a_tot_month.csv"),

    d3.csv("data/tot_month/f5b_tot_month.csv"),
    d3.csv("data/tot_month/f6a_tot_month.csv"),
    d3.csv("data/tot_month/f6b_tot_month.csv"),
    d3.csv("data/tot_month/f7a_tot_month.csv"),
    d3.csv("data/tot_month/f7b_tot_month.csv"),

];

// after loading the data, passing the datasets to the cleanData function
Promise.all(promises)
    .then(function (data) {
        cleanData(data)
        // initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

// clean up the datasets
// converting values to numbers
// parsing out the date and time information
function cleanData(dataArray){
    for (let j=0; j<15; j++) {
        for (let i = 0; i < dataArray[j].length; i++) {
            dataArray[j][i]['electricity_net'] = +dataArray[j][i]['electricity_net'];
            dataArray[j][i]['electricity_total'] = +dataArray[j][i]['electricity_total'];
            dataArray[j][i]['energy_net'] = +dataArray[j][i]['energy_net'];
            dataArray[j][i]['energy_total'] = +dataArray[j][i]['energy_total'];
            dataArray[j][i]['fuelOil_total'] = +dataArray[j][i]['fuelOil_total'];
            dataArray[j][i]['naturalGas_total'] = +dataArray[j][i]['naturalGas_total'];
            dataArray[j][i]['propane_total'] = +dataArray[j][i]['propane_total'];
            dataArray[j][i]['hr'] = +dataArray[j][i]['hr'];
            dataArray[j][i]['min'] = +dataArray[j][i]['min'];
            dataArray[j][i]['sec'] = (+dataArray[j][i]['hr'])*3600 + (+dataArray[j][i]['min'])*60
        }
    }

    for (let k=15; k<30; k++) {
        for (let i = 0; i < dataArray[k].length; i++) {
            dataArray[k][i]['electricity_net'] = +dataArray[k][i]['electricity_net'];
            dataArray[k][i]['electricity_total'] = +dataArray[k][i]['electricity_total'];
            dataArray[k][i]['energy_net'] = +dataArray[k][i]['energy_net'];
            dataArray[k][i]['energy_total'] = +dataArray[k][i]['energy_total'];
            dataArray[k][i]['fuelOil_total'] = +dataArray[k][i]['fuelOil_total'];
            dataArray[k][i]['naturalGas_total'] = +dataArray[k][i]['naturalGas_total'];
            dataArray[k][i]['propane_total'] = +dataArray[k][i]['propane_total'];
            dataArray[k][i]['month'] = +dataArray[k][i]['month'];
            dataArray[k][i]['hr'] = +dataArray[k][i]['hr'];
        }
    }
    console.log("cleanedData: ", dataArray)
    initMainPage(dataArray);
}

// console.log("new dataset: ", datasets)
// initMainPage(datasets);

// initMainPage
function initMainPage(dataArray) {
    // console.log(dataArray)
    // initialize the tooltips and legends
    myAreaChartTooltip = new AreaChartTooltip('areaChart-tooltip','areaChart-0',dataArray);
    myAreaChartLegend = new AreaChartLegend('areaChart-legend');

    // initialize the daily area charts
    myAreaChart0 = new AreaChart('areaChart-0', dataArray[0], dataList[0]);
    myAreaChart1 = new AreaChart('areaChart-1', dataArray[1], dataList[1]);
    myAreaChart2 = new AreaChart('areaChart-2', dataArray[2], dataList[2]);
    myAreaChart3 = new AreaChart('areaChart-3', dataArray[3], dataList[3]);
    myAreaChart4 = new AreaChart('areaChart-4', dataArray[4], dataList[4]);
    myAreaChart5 = new AreaChart('areaChart-5', dataArray[5], dataList[5]);
    myAreaChart6 = new AreaChart('areaChart-6', dataArray[6], dataList[6]);
    myAreaChart7 = new AreaChart('areaChart-7', dataArray[7], dataList[7]);
    myAreaChart8 = new AreaChart('areaChart-8', dataArray[8], dataList[8]);
    myAreaChart9 = new AreaChart('areaChart-9', dataArray[9], dataList[9]);
    myAreaChart10 = new AreaChart('areaChart-10', dataArray[10], dataList[10]);
    myAreaChart11 = new AreaChart('areaChart-11', dataArray[11], dataList[11]);
    myAreaChart12 = new AreaChart('areaChart-12', dataArray[12], dataList[12]);
    myAreaChart13 = new AreaChart('areaChart-13', dataArray[13], dataList[13]);
    myAreaChart14 = new AreaChart('areaChart-14', dataArray[14], dataList[14]);

    // initialize the monthly area charts
    myAreaChartMonth0 = new AreaChartMonth('areaChartMonth-0', dataArray[15], dataList[0], 15);
    myAreaChartMonth1 = new AreaChartMonth('areaChartMonth-1', dataArray[16], dataList[1], 16);
    myAreaChartMonth2 = new AreaChartMonth('areaChartMonth-2', dataArray[17], dataList[2], 17);
    myAreaChartMonth3 = new AreaChartMonth('areaChartMonth-3', dataArray[18], dataList[3], 18);
    myAreaChartMonth4 = new AreaChartMonth('areaChartMonth-4', dataArray[19], dataList[4], 19);
    myAreaChartMonth5 = new AreaChartMonth('areaChartMonth-5', dataArray[20], dataList[5], 20);
    myAreaChartMonth6 = new AreaChartMonth('areaChartMonth-6', dataArray[21], dataList[6],21);
    myAreaChartMonth7 = new AreaChartMonth('areaChartMonth-7', dataArray[22], dataList[7],22);
    myAreaChartMonth8 = new AreaChartMonth('areaChartMonth-8', dataArray[23], dataList[8],23);
    myAreaChartMonth9 = new AreaChartMonth('areaChartMonth-9', dataArray[24], dataList[9],24);
    myAreaChartMonth10 = new AreaChartMonth('areaChartMonth-10', dataArray[25], dataList[10],25);
    myAreaChartMonth11 = new AreaChartMonth('areaChartMonth-11', dataArray[26], dataList[11],26);
    myAreaChartMonth12 = new AreaChartMonth('areaChartMonth-12', dataArray[27], dataList[12],27);
    myAreaChartMonth13 = new AreaChartMonth('areaChartMonth-13', dataArray[28], dataList[13],28);
    myAreaChartMonth14 = new AreaChartMonth('areaChartMonth-14', dataArray[19], dataList[14],29);

}


// getting the button value and update all the charts
function displayRadioValue() {
    let button_chart = document.getElementsByName('energy_type');

    for(i = 0; i < button_chart.length; i++) {
        if(button_chart[i].checked)
            button_chart_value = button_chart[i].value;
    }



    // update the daily area chart
    myAreaChart0.updateVis();
    myAreaChart1.updateVis();
    myAreaChart2.updateVis();
    myAreaChart3.updateVis();
    myAreaChart4.updateVis();
    myAreaChart5.updateVis();
    myAreaChart6.updateVis();
    myAreaChart7.updateVis();
    myAreaChart8.updateVis();
    myAreaChart9.updateVis();
    myAreaChart10.updateVis();
    myAreaChart11.updateVis();
    myAreaChart12.updateVis();
    myAreaChart13.updateVis();
    myAreaChart14.updateVis();

    // update the monthly area chart
    myAreaChartMonth0.updateVis();
    myAreaChartMonth1.updateVis();
    myAreaChartMonth2.updateVis();
    myAreaChartMonth3.updateVis();
    myAreaChartMonth4.updateVis();
    myAreaChartMonth5.updateVis();
    myAreaChartMonth6.updateVis();
    myAreaChartMonth7.updateVis();
    myAreaChartMonth8.updateVis();
    myAreaChartMonth9.updateVis();
    myAreaChartMonth10.updateVis();
    myAreaChartMonth11.updateVis();
    myAreaChartMonth12.updateVis();
    myAreaChartMonth13.updateVis();
    myAreaChartMonth14.updateVis();

    console.log(button_chart_value)
}