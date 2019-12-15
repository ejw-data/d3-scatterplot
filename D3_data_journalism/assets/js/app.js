// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "healthcare";



// function used for updating x or y scale var upon click on axis label
function axisScale(dataArray, variable, axis) {
  
  if (axis==='x'){
 
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([
            d3.min(dataArray, d => d[variable]) * 0.8,
            d3.max(dataArray, d => d[variable]) * 1.2
        ])
        .range([0, width]);

        return xLinearScale;   //scaled array

    }

    else if (axis ==='y'){
      
        var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(dataArray, d => d[variable]) * 1.2])
        .range([height, 0]);

        return yLinearScale;   //scaled array

    }
    else {
        return console.log('Axis not selected - Function axisScale')
    }
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newScale, xyAxis, axisSelect) {
  
  if (axisSelect === 'x'){
    var bottomAxis = d3.axisBottom(newScale);

    xyAxis.transition()
      .duration(1000)
      .call(bottomAxis);

    return xyAxis;
  }
  else if (axisSelect === 'y'){
    var leftAxis = d3.axisLeft(newScale);
    console.log("left");

    xyAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return xyAxis;

  }
  else{
    alert('renderAxes did not run')
  }
}





// Load data
var path="assets/data/data.csv";
d3.csv(path).then(function(healthData, err){
    //console.log(data)
    if (err) throw err;

    // parse data
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;

    });
  
    // xLinearScale function above csv import
    var xLinearScale = axisScale(healthData, chosenXAxis, 'x');
  
    // Create y scale function
    var yLinearScale = axisScale(healthData, chosenYAxis, 'y')

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");

      // Create group for  3 x- axis labels
        var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var horizontal1Label = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Age");

        var horizontal2Label = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Income");

        var horizontal3Label = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .text("Poverty");

        // Create group for  2 x- axis labels
        var verticalGroup = chartGroup.append("g")
        .attr("transform", `translate(${0}, 0-${height/2})`);

        // append y axis
        var vertical1Label = verticalGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", "healthcare")
        .classed("active", true)
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Percent with Healthcare");

        var vertical2Label = verticalGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", "obesity")
        .classed("inactive", true)
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Obesity");

        var vertical3Label = verticalGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("value", "smokes")
        .classed("inactive", true)
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Smokes");

          // x axis labels event listener
  labelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");

   
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = axisScale(healthData, chosenXAxis, 'x');

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis, 'x');

      // updates circles with new x values
      //circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      //circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "age") {
        horizontal1Label
          .classed("active", true)
          .classed("inactive", false);
        horizontal2Label
          .classed("active", false)
          .classed("inactive", true);
        horizontal3Label
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXAxis === "income"){
        horizontal1Label
          .classed("active", false)
          .classed("inactive", true);
        horizontal2Label
          .classed("active", true)
          .classed("inactive", false);
        horizontal3Label
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        horizontal1Label
          .classed("active", false)
          .classed("inactive", true);
        horizontal2Label
          .classed("active", false)
          .classed("inactive", true);
        horizontal3Label
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  
  });

  // y axis labels event listener
  verticalGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");

    
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = axisScale(healthData, chosenYAxis, 'y');

      // updates x axis with transition
      yAxis = renderAxes(yLinearScale, yAxis,'y');
    

      // updates circles with new x values
      //circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      //circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "healthcare") {
        vertical1Label
          .classed("active", true)
          .classed("inactive", false);
        vertical2Label
          .classed("active", false)
          .classed("inactive", true);
        vertical3Label
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "obesity"){
        vertical1Label
          .classed("active", false)
          .classed("inactive", true);
        vertical2Label
          .classed("active", true)
          .classed("inactive", false);
        vertical3Label
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        vertical1Label
          .classed("active", false)
          .classed("inactive", true);
        vertical2Label
          .classed("active", false)
          .classed("inactive", true);
        vertical3Label
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  
  });

});