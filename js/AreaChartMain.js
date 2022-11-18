/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let myAreaChart0;
let myAreaChart1;
let myAreaChart2;
let myAreaChart3;
let myAreaChart4;
let myAreaChart5;
let myAreaChart6;
let myAreaChart7;
let myAreaChart8;
let myAreaChart9;
let myAreaChart10;
let myAreaChart11;
let myAreaChart12;
let myAreaChart13;
let myAreaChart14;
let myAreaChartLegend;
let myUserBubbleOne;

let timeStamp_tooltip;
let climateZone_tooltip;
let button_chart_value = 'energy_total';

const dataList = ['1A','2A','2B','3A','3B', '3C', '4A','4B','4C','5A', '5B','6A','6B', '7A','7B']
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
];

Promise.all(promises)
    .then(function (data) {
        cleanData(data)
        // initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });



let datasets = {}

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
            dataArray[j][i]['time'] = +dataArray[j][i]['timestamp'].replace(/[^0-9]/g, '');
        }

        for (let i = 0; i < dataArray[j].length; i++) {
            if (i < 40 && i >= 4) {
                if (dataArray[j][i]['time'] < 100) {
                    dataArray[j][i]['time'] = dataArray[j][i]['time'] * 10
                }
            }
            if (i >=40) {
                if (dataArray[j][i]['time'] < 1000) {
                    dataArray[j][i]['time'] = dataArray[j][i]['time'] * 10
                }
            }
        }
        datasets[j] = dataArray[j];
    }
    // console.log("cleanedData: ", dataArray)
    initMainPage(dataArray);
}

// console.log("new dataset: ", datasets)
// initMainPage(datasets);


// initMainPage
function initMainPage(dataArray) {
    // console.log(dataArray)


    // myUserBubbleOne = new UserBubble('userBubble')

    myAreaChartTooltip = new AreaChartTooltip('areaChart-tooltip','areaChart-0',dataArray);
    myAreaChartLegend = new AreaChartLegend('areaChart-legend');

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

}


function displayRadioValue() {
    let button_chart = document.getElementsByName('energy_type');

    for(i = 0; i < button_chart.length; i++) {
        if(button_chart[i].checked)
            button_chart_value = button_chart[i].value;
    }

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

    console.log(button_chart_value)
}
