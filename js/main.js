// Set information for frame height/width/margins
const FRAME_HEIGHT = 450;
const FRAME_WIDTH = 450;
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

// Set vis height/width
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// Set color mapping for graphs
const color = {"setosa": "royalblue",
                "versicolor": "seagreen",
                "virginica": "salmon"};

// Build frame of scatterplot1
const FRAME1 = d3.select("#scatter1")
                  .append("svg")
                    .attr("width", FRAME_WIDTH)
                    .attr("height", FRAME_HEIGHT)
                    .attr("class", "frame");

// Load the data from the CSV file
d3.csv("data/iris.csv").then((data) => {

    // Create the scatterplot points
    FRAME1.selectAll("points")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", function(d,i) { console.log("pt" + d.id); return "pt" + d.id; })
            // calculations for x: increases scale to be visible to user + margin adjustment
            .attr("cx", (d) => { return (parseFloat(d.Sepal_Length) * VIS_WIDTH/8) + MARGINS.left; })
            // calculations for y: increases scale, considers our perception of x/y plane, margins
            .attr("cy", (d) => { return ((7 - parseFloat(d.Petal_Length)) * VIS_HEIGHT/8) + MARGINS.top; })
            .attr("fill", function(d,i) { console.log(d.Species, color[d.Species]); return color[d.Species]; })
            .attr("r", 4)
            .attr("opacity", 0.5);

    // Add axis to the graph: establish scale functions for x/y
    const X_AXIS_SCALE = d3.scaleLinear()
        .domain([0, 8])
        .range([0, VIS_WIDTH]);

    const Y_AXIS_SCALE = d3.scaleLinear()
        .domain([0, 7])
        .range([VIS_HEIGHT, 0]);

    // Add x-axis
    FRAME1.append("g")
        .attr("transform", "translate(" + MARGINS.left + 
        "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_AXIS_SCALE).ticks(8)) 
        .attr("font-size", "10px"); 

    // Add y-axis
    FRAME1.append("g")
        .attr("transform", "translate(" + MARGINS.left +
        "," + MARGINS.top + ")")
        .call(d3.axisLeft(Y_AXIS_SCALE).ticks(7))
        .attr("font-size", "10px");
  
});

// Build frame of scatterplot2
const FRAME2 = d3.select("#scatter2")
                  .append("svg")
                    .attr("width", FRAME_WIDTH)
                    .attr("height", FRAME_HEIGHT)
                    .attr("class", "frame");

// Load the data from the CSV file
d3.csv("data/iris.csv").then((data) => {

    // Create the scatterplot points
    FRAME2.selectAll("points")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", function(d,i) { return "pt" + d.id; })
            // calculations for x: increases scale to be visible to user + margin adjustment
            .attr("cx", (d) => { return (parseFloat(d.Sepal_Width) * VIS_WIDTH/5) + MARGINS.left; })
            // calculations for y: increases scale, considers our perception of x/y plane, margins
            .attr("cy", (d) => { return ((3 - parseFloat(d.Petal_Width)) * VIS_HEIGHT/3) + MARGINS.top; })
            .attr("fill", function(d,i) { return color[d.Species]; })
            .attr("r", 4)
            .attr("opacity", 0.5)

            // Creating the interactions with both graphs
            .on("mouseover", function(d, i) {
                console.log(i["Species"])
                d3.selectAll("circle.pt" + i["id"])
                    .attr("stroke-width", "2")
                    .attr("opacity", 1)
                    .attr("stroke", "black")
                d3.selectAll("rect.bar" + i["Species"])
                    .attr("stroke-width", "3")
                    .attr("opacity", 1)
                    .attr("stroke", "orange")
            })
            .on("mouseout", function(d, i) {
                d3.selectAll("circle.pt" + i["id"])
                    .attr("opacity", 0.5)
                    .attr("stroke", "none")
                d3.selectAll("rect.bar" + i["Species"])
                    .attr("opacity", 0.5)
                    .attr("stroke", "none")

            });

    // Add axis to the graph: establish scale functions for x/y
    const X_AXIS_SCALE = d3.scaleLinear()
        .domain([0, 5])
        .range([0, VIS_WIDTH]);

    const Y_AXIS_SCALE = d3.scaleLinear()
        .domain([0, 3])
        .range([VIS_HEIGHT, 0]);

    // Add x-axis
    FRAME2.append("g")
        .attr("transform", "translate(" + MARGINS.left + 
        "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_AXIS_SCALE).ticks(5)) 
        .attr("font-size", "10px"); 

    // Add y-axis
    FRAME2.append("g")
        .attr("transform", "translate(" + MARGINS.left +
        "," + MARGINS.top + ")")
        .call(d3.axisLeft(Y_AXIS_SCALE).ticks(3))
        .attr("font-size", "10px");
  
});


let data = [
  { species: 'setosa', value: 50 },
  { species: 'versicolor', value: 50 },
  { species: 'virginica', value: 50 }
];

// Build frame of bar graph
const FRAME3 = d3.select("#bargraph")
                  .append("svg")
                    .attr("width", FRAME_WIDTH)
                    .attr("height", 700)
                    .attr("class", "frame");

let xScale = d3.scaleBand().range([0, VIS_WIDTH]).padding(0.4);
let yScale = d3.scaleLinear().range([VIS_HEIGHT, 0]);

let g = FRAME3.append("g").attr("transform", "translate("+30+","+50+")");

xScale.domain(['setosa', 'versicolor', 'virginica']);
yScale.domain([0, 60]);

g.append("g").attr('transform', 'translate(0,'+VIS_HEIGHT+ ')').call(d3.axisBottom(xScale));

g.append('g').call(d3.axisLeft(yScale).ticks(10));

g.selectAll(".point")
    .data(data)
    .enter().append("rect")
    .attr("class", function(d) { return 'bar' + d.species; })
    .attr("x", function(d) { return xScale(d.species); })
    .attr("y", function(d) { return yScale(d.value); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return VIS_HEIGHT - yScale(d.value);})
    .attr("fill", function(d) { return color[d.species]; })
    .attr("opacity", 0.5)







