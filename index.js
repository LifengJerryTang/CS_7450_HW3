let width = 1200
let height = 600
let margin = {top: 50, right: 50, bottom: 50, left: 50}
let padding = {top: 50, right: 50, bottom: 50, left: 50}


d3.dsv(",", "https://raw.githubusercontent.com/fuyuGT/CS7450-data/main/atl_weather_20to22.csv", function(d) {
    return {
        date: new Date(d['Date']),
        tempMax: +d['TempMax'],
        tempMin: +d['TempMin']
    }
}).then(function(data) {

    let xScale = d3.scaleTime();
    let yScale = d3.scaleLinear();

    let minDate = data[0].date;
    let maxDate = data[data.length - 1].date;
    let maxTempMax = d3.max(data, d => d.tempMax)

    xScale.domain([minDate, maxDate])
        .range([0, width]);

    yScale.domain([0, maxTempMax])
        .range([height, 0]);

    let line = d3.line()
        .x(function(d) { return xScale(d.date);})
        .y(function(d) { return yScale(d.tempMax)});

    let line2 = d3.line()
        .x(function(d) { return xScale(d.date);})
        .y(function(d) { return yScale(d.tempMin)});

    let svg = d3.select("#line_chart")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    svg.append("text")
        .text("Highest and Lowest Temperature by Date in Atlanta")
        .attr("id", 'line_chart_title')
        .attr("font-size", 22)
        .attr("x", width /2 - padding.right * 2)
        .attr("y", padding.top / 3)

    svg.append('g').attr('id', 'line_chart_plot')

    svg.select('#line_chart_plot')
        .append("path")
        .datum(data)
        .attr("d", line)
        .attr("stroke-width", 3)
        .attr("stroke", d3.schemeCategory10[3])
        .attr("fill", "None")
        .attr("transform", "translate(100, 40)");

    svg.select('#line_chart_plot')
        .append("path")
        .datum(data)
        .attr("d", line2)
        .attr("stroke-width", 3)
        .attr("stroke", d3.schemeCategory10[0])
        .attr("fill", "None")
        .attr("transform", "translate(100, 40)");

    svg.select("#line_chart_plot")
        .append("g")
        .attr("id", "line_chart_x_axis")
        .attr("class", "axis")
        .attr("transform", "translate(100," + (height) + ")")
        .call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%b %y")));

    svg.select("#line_chart_x_axis")
        .append("text")
        .text("Month")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("transform", "translate(500, 40)");

    svg.select("#line_chart_plot").
    append("g")
        .attr("id", "line_chart_y_axis")
        .attr("class", "axis")
        .attr("transform", "translate(" + 100 + ", "+ "0)")
        .call(d3.axisLeft(yScale));

    svg.select("#line_chart_y_axis")
        .append("text")
        .text("Temperature (Fahrenheit)")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("transform", "translate(-35, 200), rotate(270)");

})

d3.dsv(",", "https://raw.githubusercontent.com/fuyuGT/CS7450-data/main/state_crime.csv", function(d) {
    return {
        population: +d["Data.Population"],
        assaultTotal: +d["Data.Totals.Violent.Assault"],
        robberyTotal: +d["Data.Totals.Violent.Robbery"]
    }
}).then(function(data) {

    data = data.filter(d => d.population >= 100000000)
    
    let maxAssaultTotal = d3.max(data, d => d.assaultTotal);
    let maxRobberyTotal = d3.max(data, d => d.robberyTotal);
    let maxPopulation = d3.max(data, d => d.population);

    let xScale = d3.scaleLinear().domain([0, maxAssaultTotal]).range([0, width - margin.right])
    let yScale = d3.scaleLinear().domain([0, maxRobberyTotal]).range([height, 0])

    let svg = d3.select("#scatter_plot")
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    svg.append("text")
    .text("Relationship Between Assault Count and Robbery Count")
    .attr("id", 'line_chart_title')
    .attr("font-size", 22)
    .attr("x", width /2 - padding.right * 2)
    .attr("y", padding.top / 3)

    let circleGroup = svg.append('g').attr('transform', 'translate(' + 100 + ',' + 0 + ')');

    circleGroup.append('g')
        .selectAll(".myDots")
        .data(data)
        .enter()
        .append("circle")
        .attr('class', 'myDots')
        .attr("cx", d => xScale(d.assaultTotal))
        .attr("cy", d => yScale(d.robberyTotal))
        .attr("r", d => (d.population / maxPopulation) * 10.0)
        .style("fill", d3.schemeCategory10[9])

    //add x axis
    circleGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .text("Violent Assault Count")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("transform", "translate(500, 60)");;

    //add y axis 
    circleGroup.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .text("Violent Robbery Count")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("transform", "translate(-65, 200), rotate(270)");
;

})

d3.dsv(",", "https://raw.githubusercontent.com/fuyuGT/CS7450-data/main/countries.csv", function(d) {
    return {
        countryName: d['Country'],
        populationGrowth: +d['UrbanPopulationPercentGrowth'],
    }
}).then(function(data) {

    aggregatedData = Array.from(d3.rollup(data, v => d3.mean(v, d => d.populationGrowth), d => d.countryName))

    data = []

    let maxAvgPopGrowth = null;
    let minAvgPopGrowth = null;

    aggregatedData.forEach(d => {

        if (!maxAvgPopGrowth) {
            maxAvgPopGrowth = d[1];
        } else {
            maxAvgPopGrowth = Math.max(d[1], maxAvgPopGrowth);
        }

        if (!minAvgPopGrowth) {
            minAvgPopGrowth = d[1];
        } else {
            minAvgPopGrowth = Math.min(d[1], minAvgPopGrowth);
        }

        data.push({
            countryName: d[0],
            avgPopGrowth: d[1],
            color: getRandomColor()
        })
    })


    let xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.countryName))
        .rangeRound([0, width])
        .padding(0.1)

    let yScale = d3.scaleLinear().domain([minAvgPopGrowth,  maxAvgPopGrowth]).range([height, 0]);

    let svg = d3.select("#bar_chart")
        .attr('height', height + margin.top * 3)
        .attr('width', width + margin.left + margin.right)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .text("Average Urban Population Growth of South American and European Countries (Year 1980 - 2013)")
        .attr("id", 'line_chart_title')
        .attr("font-size", 22)
        .attr("x", width / 2 - margin.right * 6)
        .attr("y", padding.top / 3)


    svg.append('g').attr('id', 'bar_container').attr("transform", "translate(0," + margin.top + ")");;

    svg.select("#bar_container")
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => Math.abs(yScale(d.avgPopGrowth) - yScale(0)))
        .attr('x', d => xScale(d.countryName))
        .attr('y', d => yScale(Math.max(0, d.avgPopGrowth)) )
        .attr('fill', d => d.color)
        .attr("transform", "translate(100, 0)");

    svg.select("#bar_container").append("g")
        .attr("id", "bar_chart_x_axis")
        .attr("class", "axis")
        .attr("transform", "translate(100," + (height) + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .append("text")
        .text("Countries")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("transform", "translate(500, 40)");;


    svg.select("#bar_container").append("g")
        .attr("id", "bar_chart_y_axis")
        .attr("class", "axis")
        .attr("transform", "translate(" + 100 + ", "+ "0)")
        .call(d3.axisLeft(yScale))

    svg.select("#bar_chart_y_axis").append("text")
        .text("Average Urban Population Growth")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("transform", "translate(-65, 200), rotate(270)");

    svg.select('#bar_chart_x_axis').append('g')
        .append("text")
        .text("Country")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("transform", "translate(550, 70)");
})

function getRandomColor() {
    return '#'+ Math.floor(Math.random() * 12777215 + 2777215).toString(16);
}

