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

// Build frame of scatterplot2
const FRAME2 = d3.select("#scatter2")
                  .append("svg")
                    .attr("width", FRAME_WIDTH)
                    .attr("height", FRAME_HEIGHT)
                    .attr("class", "frame");
                      
// Build frame of bar graph
const FRAME3 = d3.select("#bargraph")
                    .append("svg")
                        .attr("width", FRAME_WIDTH)
                        .attr("height", 700)
                        .attr("class", "frame");

// Load the data from the CSV file
d3.csv("data/iris.csv").then((data) => {

    // Create the scatterplot points
    const graph1 = FRAME1.selectAll("points")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", function(d,i) { return "pt" + d.id + " point"; })
            // calculations for x: increases scale to be visible to user + margin adjustment
            .attr("cx", (d) => { return (parseFloat(d.Sepal_Length) * VIS_WIDTH/8) + MARGINS.left; })
            // calculations for y: increases scale, considers our perception of x/y plane, margins
            .attr("cy", (d) => { return ((7 - parseFloat(d.Petal_Length)) * VIS_HEIGHT/8) + MARGINS.top; })
            .attr("fill", function(d,i) { return color[d.Species]; })
            .attr("r", 4)
            .attr("opacity", 0.5);

    // Add axis to the graph: establish scale functions for x/y
    const X_AXIS_SCALE1 = d3.scaleLinear()
        .domain([0, 8])
        .range([0, VIS_WIDTH]);

    const Y_AXIS_SCALE1 = d3.scaleLinear()
        .domain([0, 7])
        .range([VIS_HEIGHT, 0]);

    // Add x-axis
    FRAME1.append("g")
        .attr("transform", "translate(" + MARGINS.left + 
        "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_AXIS_SCALE1).ticks(8)) 
        .attr("font-size", "10px"); 

    // Add y-axis
    FRAME1.append("g")
        .attr("transform", "translate(" + MARGINS.left +
        "," + MARGINS.top + ")")
        .call(d3.axisLeft(Y_AXIS_SCALE1).ticks(7))
        .attr("font-size", "10px");

    const brush = d3.brush()
        .extent([[MARGINS.right, MARGINS.top], [FRAME_WIDTH - MARGINS.left, FRAME_HEIGHT - MARGINS.bottom]])
        .on("start brush end", brushed);
      
    FRAME2.call(brush);


    // Create the scatterplot points
    const graph2 = FRAME2.selectAll("points")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", function(d,i) { return "pt" + d.id + " point"; })
            // calculations for x: increases scale to be visible to user + margin adjustment
            .attr("cx", (d) => { return (parseFloat(d.Sepal_Width) * VIS_WIDTH/5) + MARGINS.left; })
            // calculations for y: increases scale, considers our perception of x/y plane, margins
            .attr("cy", (d) => { return ((3 - parseFloat(d.Petal_Width)) * VIS_HEIGHT/3) + MARGINS.top; })
            .attr("fill", function(d,i) { return color[d.Species]; })
            .attr("r", 4)
            .attr("opacity", 0.3)

            // Creating the interactions with both graphs: add highlight
            .on("mouseover", function(d, i) {
                console.log(i["Species"]);
                d3.selectAll("circle.pt" + i["id"])
                    .attr("stroke-width", "2px")
                    .attr("opacity", 1)
                    .attr("stroke", "orange");
                d3.selectAll("rect.bar" + i["Species"])
                    .attr("stroke-width", "5px")
                    .attr("opacity", 1)
                    .attr("stroke", "orange");
            })

            // Removes orange highlight
            .on("mouseout", function(d, i) {
                d3.selectAll("circle.pt" + i["id"])
                    .attr("opacity", 0.3)
                    .attr("stroke", "none");
                d3.selectAll("rect.bar" + i["Species"])
                    .attr("opacity", 0.3)
                    .attr("stroke", "none")});

    // Add axis to the graph: establish scale functions for x/y
    const X_AXIS_SCALE2 = d3.scaleLinear()
        .domain([0, 5])
        .range([0, VIS_WIDTH]);

    const Y_AXIS_SCALE2 = d3.scaleLinear()
        .domain([0, 3])
        .range([VIS_HEIGHT, 0]);

    // Add x-axis
    FRAME2.append("g")
        .attr("transform", "translate(" + MARGINS.left + 
        "," + (VIS_HEIGHT + MARGINS.top) + ")") 
        .call(d3.axisBottom(X_AXIS_SCALE2).ticks(5)) 
        .attr("font-size", "10px"); 

    // Add y-axis
    FRAME2.append("g")
        .attr("transform", "translate(" + MARGINS.left +
        "," + MARGINS.top + ")")
        .call(d3.axisLeft(Y_AXIS_SCALE2).ticks(3))
        .attr("font-size", "10px");

    



    // code for creating bar graph
    const X_AXIS_SCALE3 = d3.scaleBand()
                            .range([0, VIS_WIDTH])
                            .padding(0.4);
    const Y_AXIS_SCALE3 = d3.scaleLinear()
                            .range([VIS_HEIGHT, 0]);

    const g = FRAME3.append("g")
                    .attr("transform", "translate("+30+","+50+")");

    X_AXIS_SCALE3.domain(['setosa', 'versicolor', 'virginica']);
    Y_AXIS_SCALE3.domain([0, 60]);

    g.append("g")
        .attr('transform', 'translate(0,'+VIS_HEIGHT+ ')')
        .call(d3.axisBottom(X_AXIS_SCALE3));

    g.append('g')
        .call(d3.axisLeft(Y_AXIS_SCALE3)
        .ticks(10));

    const graph3 = g.selectAll("bars")
                    .data(data)
                    .enter()
                    .append("rect")
                        .attr("class", function(d) { return 'bar' + d.Species; })
                        .attr("x", function(d) { return X_AXIS_SCALE3(d.Species); })
                        .attr("y", Y_AXIS_SCALE3(50))
                        .attr("width", X_AXIS_SCALE3.bandwidth())
                        .attr("height", VIS_HEIGHT - Y_AXIS_SCALE3(50))
                        .attr("fill", function(d) { return color[d.Species]; })
                        .attr("opacity", 0.5);

    function brushed(event) {
        const extent = event.selection;
        console.log(extent)
        graph1.classed("selected", function(d){ 
            return isBrushed(extent, X_AXIS_SCALE2(d.Sepal_Width) + MARGINS.left, 
                                    Y_AXIS_SCALE2(d.Petal_Width) + MARGINS.top ); 
        });
        graph2.classed("selected", function(d){ 
            return isBrushed(extent, X_AXIS_SCALE2(d.Sepal_Width) + MARGINS.left, 
                                    Y_AXIS_SCALE2(d.Petal_Width) + MARGINS.top ); 
        });
        graph3.classed("selected", function(d, i) {
            return isBrushed(extent, X_AXIS_SCALE2(d.Sepal_Width) + MARGINS.left, 
                                    Y_AXIS_SCALE2(d.Petal_Width) + MARGINS.top );
        });
    };

    function isBrushed(brush_coords, cx, cy) {

        let x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];

        const bool = x0 <= cx && cx <= x1 && 
                        y0 <= cy && cy <= y1;
                        
        console.log(bool)
        return bool;   
    };


});



