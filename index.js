let margin = {top: 50, right: 50, bottom: 50, left: 50}
let width = 1100
let height = 500
let padding = {top: 60, right: 60, bottom: 60, left: 60}

var aspect = width / height,
    chart = d3.select('#chart');
d3.select(window)
  .on("resize", function() {
    var targetWidth = chart.node().getBoundingClientRect().width;
    chart.attr("width", targetWidth);
    chart.attr("height", targetWidth / aspect);
  });

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
        .attr("stroke", d3.schemeCategory10[1])
        .attr("fill", "None")
        .attr("transform", "translate(100, 40)");

    svg.select('#line_chart_plot')
        .append("path")
        .datum(data)
        .attr("d", line2)
        .attr("stroke-width", 3)
        .attr("stroke", d3.schemeCategory10[2])
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
        population: parseInt(d["Data.Population"]),
        assaultTotal: parseInt(d["Data.Totals.Violent.Assault"]),
        robberyTotal: parseInt(d["Data.Totals.Violent.Robbery"])
    }
}).then(function(data) {
    

    let maxAssaultTotal = d3.max(data, d => d.assaultTotal);
    let maxRobberyTotal = d3.max(data, d => d.robberyTotal);

    let xScale = d3.scaleLinear().domain([0, maxAssaultTotal]).range([0, width])
    let yScale = d3.scaleLinear().domain([0, maxRobberyTotal]).range([height, 0])

    let svg = d3.select("#scatter_plot")
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    let circleGroup = svg.append('g').attr('transform', 'translate(' + 100 + ',' + 0 + ')');

    circleGroup.append('g')
        .selectAll(".myDots")
        .data(data)
        .enter()
        .append("circle")
        .attr('class', 'myDots')
        .attr("cx", d => xScale(d.assaultTotal))
        .attr("cy", d => yScale(d.robberyTotal))
        .attr("r", d => d.population / 50000000)
        .style("fill", "#69b3a2")

    //add x axis
    circleGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    //add y axis 
    circleGroup.append("g")
        .call(d3.axisLeft(yScale));

})

d3.dsv(",", "https://raw.githubusercontent.com/fuyuGT/CS7450-data/main/countries.csv", function(d) {
    return {
        countryName: d['Country'],
        totalPopulation: d['PopulationTotal'],
        color: getRandomColor(),
        year: +d['Year']
    }
}).then(function(data) {

    data = data.filter(d => d.year === 2013)

    let maxTotalPopulation = d3.max(data, d => d.totalPopulation)

    let xScale = d3
        .scaleBand()
        .domain(data.map((d) => d.countryName))
        .rangeRound([0, width])

    let yScale = d3.scaleLinear().domain([0, maxTotalPopulation]).range([height, 0]);

    let svg = d3.select("#bar_chart")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")


    svg.append('g').attr('id', 'bar_container')

    svg.select("#bar_container")
        .selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .classed('bar', true)
        .attr('width', xScale.bandwidth())
        .attr('height', (d) => height - yScale(d.totalPopulation))
        .attr('x', d => xScale(d.countryName))
        .attr('y', d => yScale(d.totalPopulation) )
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
        .append("text")
        .text("Population")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("transform", "translate(-65, 200), rotate(270)");;




})



function getRandomColor() {
    return '#'+Math.floor(Math.random() * 16777215).toString(16);
}

