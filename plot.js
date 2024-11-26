const fifa = d3.csv("team.csv", d3.autoType); // Load CSV and auto-detect data types

let width = 600;
let height = 400;

let margin = {
    top: 30,
    bottom: 50,
    left: 50,
    right: 30
};

let svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "lightyellow");

fifa.then(data => {
    // Define scales
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Gls)]) // Adjust domain based on data
        .range([height - margin.bottom, margin.top]);

    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.PrgP)]) // Adjust domain based on data
        .range([margin.left, width - margin.right]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

    // Add axis labels
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom + 80 / 2)
        .attr("text-anchor", "middle")
        .text("Progressive Passes (PrgP)");

    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", margin.left / 2)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Goals (Gls)");

    // Plot points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.PrgP))
        .attr("cy", d => yScale(d.Gls))
        .attr("r", 5)
        .attr("fill", d => colorScale(d.Comp)); // Color by Squad
    const legend = svg.selectAll(".legend")
        .data(colorScale.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(" + margin.left + "," + (margin.top + i * 20) + ")"); // Adjust position
    
    legend.append("circle")
        .attr("cx", 15) // Position circle on the left
        .attr("cy", 11) 
        .attr("r", 6)
        .style("fill", d => colorScale(d)); 
    
    legend.append("text")
        .attr("x", 30) // Position text to the right of the circle
        .attr("y", 15)
        .text(d => d)
        .style("text-anchor", "start"); // Ensure text aligns properly
    
});
