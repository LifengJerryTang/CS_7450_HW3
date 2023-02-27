d3.dsv(",", "./data/atl_weather_20to22.csv", function(d) {
    return {
        date: new Date(d['Date']),
        tempMax: +d['TempMax']
    }
}).then(function(data) {

    console.log(data)

    let margin = {top: 50, right: 50, bottom: 50, left: 50}
    let width = 1000
    let height = 500

    let padding = {top: 60, right: 60, bottom: 60, left: 60}

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

    let svg = d3.select("#line_chart")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .text("Highest Temperature by Date in Atlanta")
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
        .text("Number of Ratings")
        .attr("fill", "black")
        .attr("font-size", 16)
        .attr("transform", "translate(-45, 200), rotate(270)");

})
