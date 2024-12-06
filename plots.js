const fifa = d3.csv("data_csvs/team.csv", d3.autoType);

// Define cavnas and margins
let width = 500;
let height = 350;

let margin = {
    top: 30,
    bottom: 50,
    left: 50,
    right: 30
};

fifa.then(data => {
    // find unique leagues and make colors for each league
    const leagues = d3.group(data, d => d.Comp);
    const colorScale = d3.scaleOrdinal()
        .domain(Array.from(leagues.keys()))
        .range(d3.schemeCategory10);

    // create container for subplots
    const container = d3.select("body")
        .append("div")
        .style("display", "grid")
        .style("grid-template-columns", "repeat(3, 1fr)")
        .style("gap", "20px")
        .style("margin", "20px");

    leagues.forEach((leagueData, leagueName) => {
        // create SVG for each league
        let svg = container.append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background", "lightyellow");

        // define scales
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(leagueData, d => d.Gls)])
            .range([height - margin.bottom, margin.top]);

        let xScale = d3.scaleLinear()
            .domain([0, d3.max(leagueData, d => d.PrgP)])
            .range([margin.left, width - margin.right]);

        // add axes
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));

        // add axis labels
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - margin.bottom + 40)
            .attr("text-anchor", "middle")
            .text("Progressive Passes (PrgP)");

        svg.append("text")
            .attr("x", -height / 2)
            .attr("y", margin.left / 2)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text("Goals (Gls)");

        // add league title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text(leagueName);

        // plot points
        svg.selectAll("circle")
            .data(leagueData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.PrgP))
            .attr("cy", d => yScale(d.Gls))
            .attr("r", 5)
            .attr("fill", colorScale(leagueName));
    });
    const img = document.createElement('img');
    img.src = 'image.jpg';
    img.alt = 'Description of the image';

    // Target the container
    const targetContainer = document.getElementById('target-container');

    // Append the image to the target container
    targetContainer.appendChild(img)
});
