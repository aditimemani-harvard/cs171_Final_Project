# Energy Crisis: CS171 Final Project

This repository holds the final project for CS171 Visualization course (Fall 2022), Harvard University.  

Authors: Aditi Memani([@aditimemani-harvard](https://github.com/aditimemani-harvard)), Karen Kuo([@kalunkuo](https://github.com/kalunkuo)), and Kritika Kharbanda([@krkh-1702](https://github.com/krkh-1702))


## About
Energy Crisis is a project that aims to help viewers understand the residential energy consumption patterns in the US, based on the different climate zones, building types and internal building attributes (appliance type, lighting type, window type etc.). The goal of this project is to aid homeowners, developers, architects and policymakers make sustainable building decisions.

- Website Link: https://haquesaurus.github.io/CS171_Moti_Foodies/ 
- Video Link: https://www.youtube.com/watch?v=GfSF-cFaqlU&feature=youtu.be
- Process Book Link: https://docs.google.com/document/d/1l1sBdUGVR3VOxBWHaRyQp5cefYYNaBXX0Z8NK1_wrNs/edit?usp=sharing

## Project Structure
```bash
│   .DS_Store
│   index.html
│   README.md
│
├───.idea
│       .gitignore
│       modules.xml
│       test-3.iml
│       vcs.xml
│       workspace.xml
│
├───css
│       AreaChartStyles.css
│       font-awesome.css
│       Main.css
│
├───data
│   │   .DS_Store
│   │   all_cat_res_comm.csv
│   │   appliance_energy.csv
│   │   climate_fips_sub_type.csv
│   │   comm_all.csv
│   │   incentive_energy_data.csv
│   │   lighting_energy.csv
│   │   res_all.csv
│   │   res_comm.csv
│   │   res_com_total.csv
│   │   treemap_data.json
│   │   us_county.json
│   │   window_energy_cleaned.csv
│   │   zone4.json
│   │   zone5.json
│   │   zone6.json
│   │
│   ├───other
│   │       climate_disaster_freq_country_level.csv
│   │       climate_zones.csv
│   │       country_level_co2_yearly_data.csv
│   │       country_list.csv
│   │       country_temp.csv
│   │       temp_change_country level.csv
│   │       US-temp-data.csv
│   │
│   ├───tot_min
│   │       f1a_tot_min.csv
│   │       f2a_tot_min.csv
│   │       f2b_tot_min.csv
│   │       f3a_tot_min.csv
│   │       f3b_tot_min.csv
│   │       f3c_tot_min.csv
│   │       f4a_tot_min.csv
│   │       f4b_tot_min.csv
│   │       f4c_tot_min.csv
│   │       f5a_tot_min.csv
│   │       f5b_tot_min.csv
│   │       f6a_tot_min.csv
│   │       f6b_tot_min.csv
│   │       f7a_tot_min.csv
│   │       f7b_tot_min.csv
│   │
│   └───tot_month
│           f1a_tot_month.csv
│           f2a_tot_month.csv
│           f2b_tot_month.csv
│           f3a_tot_month.csv
│           f3b_tot_month.csv
│           f3c_tot_month.csv
│           f4a_tot_month.csv
│           f4b_tot_month.csv
│           f4c_tot_month.csv
│           f5a_tot_month.csv
│           f5b_tot_month.csv
│           f6a_tot_month.csv
│           f6b_tot_month.csv
│           f7a_tot_month.csv
│           f7b_tot_month.csv
│
├───img
│   │   .DS_Store
│   │   A.png
│   │   energy_type_speed.mp4
│   │   K.png
│   │   res_vs_comm.mp4
│   │
│   ├───building_types
│   │       .DS_Store
│   │       mobile_home.png
│   │       multi-2-4.png
│   │       multi-5.png
│   │       single-attached.png
│   │       single-detached.png
│   │
│   ├───climate_type
│   │       cold.png
│   │       dry.png
│   │       hot.png
│   │       humid.png
│   │       Marine.png
│   │       Mixed.png
│   │       subartic.png
│   │       very_cold.png
│   │
│   └───stacked_chart
│       │   .DS_Store
│       │   TotalCommercial.jpeg
│       │   TotalResidential.jpeg
│       │
│       ├───commercial
│       │       DeliveredEnergy.jpeg
│       │       DistillateFuelOil.jpg
│       │       EnergyRelatedLosses.jpeg
│       │       NaturalGas.jpg
│       │       Petroleum.jpg
│       │       PurchasedElectricity.jpg
│       │
│       └───residential
│               DeliveredEnergy.jpeg
│               DistillateFuelOil.jpg
│               EnergyRelatedLosses.jpeg
│               NaturalGas.jpg
│               Petroleum.jpg
│               PurchasedElectricity.jpg
│
└───js
    │   .DS_Store
    │   AreaChart.js
    │   AreaChartLegend.js
    │   AreaChartMain.js
    │   AreaChartMonth.js
    │   AreaChartTooltip.js
    │   bootstrap.min.js
    │   dendo.js
    │   fadein-scroll.js
    │   flipcardv2.js
    │   flipStackedBarChartv1.js
    │   introduction.js
    │   jquery.counterup.min.js
    │   jquery.vide.js
    │   map-county2.js
    │   map-state.js
    │   stackedBar1.js
    │   toTheTop.js
    │   treemap.js
    │   verticalNavBar.js
    │   viz.js
    │
    ├───comm-chart
    │       comm_stackedAreaChart.js
    │
    ├───res-chart
    │       res_cat_stackedAreaChart.js
    │
    └───res-comm-chart
            resComm_stackedAreaChart.js

```

## Usage
1. Clone the repository to your local system
2. Open ``` index.html ``` in a browser or run through a local server (ideally through WebStorm or ```python3 -m http.server```)


## Navigating the Website
1. Introduction
   - A rising trend for temperatures globally is highlighted through a novel visualization that maps the rise in temperatures from 1960-2021 for all the countries.
   - As one hovers over the visualization, the tooltips how the temperature rise, and the no. of countries (highlighted in red) that have surpassed a normal threshold      of temperature.

2. The Built Environment
   	- This section shows a comparison between residential and commercial building numbers to show that we need to focus on residential more.
   	- Comparison between residential and commercial energy patterns is shown when the user clicks on the cards, and hovers on the stacked area charts

3. Energy consumption based on Climate Zones
	- US map at county level to show climate zone and characteristics, supported by a legend
	- Area charts that show energy consumption pattern for different types of energy source (electricity, fuel oil, natural gas, and propane) in a day
	- Area charts that compare the shape of energy consumption in a day for different climate zones

4. Energy consumption based on Residential Building Types
	- Dendrogram chart that zooms in on climate zones 4,5 and 6 (as an example) to show energy consumption values for different residential buildings, different 	structural material types and the year built.

5. Energy consumption based on Building Attributes
	- Treemap that compares different energy types, and shows the element or attribute in a building that uses that energy type
	- Stacked bar charts that indicate the energy consumption, cost and rated lifespan for different -
		- Window Type
		- Lighting Type
		- Appliance Type

6. Financial Incentives
	- A map that shows the number of financial incentives that exist for homeowners and builders to make retrofits in their residential buildings that can reduce 		the energy use numbers. In the same map, we show the current total energy use per state as a message to policy makers on where the reforms are needed.


## Libraries

1. Bootstrap:
    1. https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css
    2. https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js
    3. https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js
2. Fonts:
    1. https://fonts.googleapis.com/css?family=Lato
3. D3:
    1. https://d3js.org/d3.v7.min.js
    2. https://d3js.org/d3-array.v2.min.js
    3. https://d3js.org/d3-geo.v2.min.js
    4. https://d3js.org/d3-scale-chromatic.v1.min.js
    5. https://d3js.org/topojson.v2.min.js
    6. https://d3js.org/d3-geo.v1.min.js
4. Miscellaneous:
    1. https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js
    2. https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js
 
 
## Data Sources

1. Wilson, EJ. H. et. al. 2022. End-Use Load Profiles for the U.S. Building Stock: Methodology and Results of Model Calibration, Validation, and Uncertainty Quantification. Golden, CO: National Renewable Energy Laboratory. NREL/TP-5500-80889.[LINK](https://www.osti.gov/biblio/1854582/)
2. Find Policies & Incentives by State. DSIRE USA. [LINK](https://www.dsireusa.org/)
3. Building America Best Practices Series, Volume 7.3, Guide to Determining Climate Regions by County, Pacific Northwest National Laboratory, August 2015.
Kadric´ D. et. al. October 2021. Cost-related analysis of implementing energy-efficient retrofit measures in the residential building sector of a middle-income country – A case study of Bosnia and Herzegovina. Energy & Buildings 257 (2022) 111765.
4. Latini, A. et. al.2015. IEE/12/758/SI2.644752 D.6.7. Best practices for improving energy efficiency in Fruit and Vegetable processing plants.
5. Aksoezen M. et. al. October 2014. Building age as an indicator for energy consumption. Energy and Buildings 87 (2015) 74–86
6. Hyedari A. et. al. 2021. Effects of different window configurations on energy consumption in building : Optimization and economic analysis. Journal of Building Engineering 35 (2021) 102099
7. Residential vs. Commercial Energy Use, Solar Feeds.
8. States Investing the Most in New Housing, Construction Coverage.https://constructioncoverage.com/research/states-investing-the-most-in-new-housing
9. ASHRAE Climate Zones, Open EI. [LINK](https://openei.org/wiki/ASHRAE_Climate_Zones)





