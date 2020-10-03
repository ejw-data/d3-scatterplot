
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
  
  // function used for updating xAxis or yAxis var upon click on axis label
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
      //console.log("left");
  
      xyAxis.transition()
        .duration(1000)
        .call(leftAxis);
  
      return xyAxis;
  
    }
    else{
      alert('renderAxes did not run')
    }
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCircles(circlesGroup, newScale, chosenAxis, axisSelect) {
    if (axisSelect === "x") {
      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newScale(d[chosenAxis]));
  
      return circlesGroup;
    }
    if (axisSelect === "y") {
      circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newScale(d[chosenAxis]));
  
      return circlesGroup;
    }
    else {
      return console.log("renderCircles did not execute");
    }
  }
  
  // function used for updating circles text group with a transition to
  // new circles
  function rendertextCircles(textcirclesGroup, newScale, chosenAxis, axisSelect) {
    if (axisSelect === "x") {
      textcirclesGroup.transition()
        .duration(1000)
        .attr("x", d => newScale(d[chosenAxis]));
      
      return textcirclesGroup;
    }
    if (axisSelect === "y") {
      textcirclesGroup.transition()
      .duration(1000)
      .attr("y", d => newScale(d[chosenAxis]));
  
      return textcirclesGroup;
    }
    else {
      return console.log("rendertextCircles did not execute");
    }
  }
  





// @TODO: YOUR CODE HERE!
// Responsive - http://bl.ocks.org/josiahdavis/a3534073492ca37b3682
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



// Load data
var path="assets/data/data.csv";
d3.csv(path).then(function(healthData, err){
    //console.log(healthData)
    if (err) throw err;

    // parse data
    healthData.forEach(function(data) {
      data.abbr = data.abbr;
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.income = +data.income;
      data.obesity = +data.obesity;
      data.smokes = +data.smokes;
    });
    
    // NEW *********************************//
    var xMin;
    var xMax;
    var yMin;
    var yMax;


  // This function allows us to set up tooltip rules (see d3-tip.js).
            var toolTip = d3
                .tip()
                .attr("class", "d3-tip")
                .offset([40, -80])
                .html(function(d) {
                // x key
                var theX;
                // Grab the state name.
                var theState = "<div>" + d.state + "</div>";
                // Snatch the y value's key and value.
                var theY = "<div>" + chosenYAxis + ": " + d[chosenYAxis] + "%</div>";
                // If the x key is poverty
                if (chosenXAxis === "poverty") {
                    // Grab the x key and a version of the value formatted to show percentage
                    theX = "<div>" + chosenXAxis + ": " + d[chosenXAxis] + "%</div>";
                }
                // add the else so that the percent is not included.
                else {
                    // Otherwise
                    // Grab the x key and a version of the value formatted to include commas after every third digit.
                    theX = "<div>" + chosenXAxis + ": " + parseFloat(d[chosenXAxis]).toLocaleString("en") + "</div>";
                }
                // Display what we capture.
                return theState + theX + theY;
                });
            // Call the toolTip function.
            chartGroup.call(toolTip);


    // END NEW *****************************//

    // xLinearScale function above csv import
    var xLinearScale = axisScale(healthData, chosenXAxis, 'x');
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
        // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

  
    // Create y scale function
    var yLinearScale = axisScale(healthData, chosenYAxis, 'y')
    // Create initial axis functions
    var leftAxis = d3.axisLeft(yLinearScale);
    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);


    // New code 
    var circlesGroupAll = chartGroup.selectAll("g circlesGroup").data(healthData).enter();


            // append initial circles
            var circlesGroup = circlesGroupAll
                .append("circle")
                .attr("cx", d => xLinearScale(d[chosenXAxis]))
                .attr("cy", d => yLinearScale(d[chosenYAxis]))
                .attr("r", 8)
                .classed("stateCircle", true)
                // .append("text")
                // .text(d => d.abbr)
                // .classed("stateText",true)
                //.attr("opacity", ".5")
                // Hover rules
                .on("mouseover", function(d) {
                    // Show the tooltip
                    toolTip.show(d, this);
                    // Highlight the state circle's border
                    d3.select(this).style("stroke", "#323232");
                })
                .on("mouseout", function(d) {
                    // Remove the tooltip
                    toolTip.hide(d);
                    // Remove highlight
                    d3.select(this).style("stroke", "#e3e3e3");
                });

                // append text to circles
            var textcirclesGroup = circlesGroupAll
                .append("text")
                .text((d) => d.abbr)
                .attr('x', d => xLinearScale(d[chosenXAxis]))
                .attr('y', d => yLinearScale(d[chosenYAxis]))
                .classed("stateText", true)
        // Hover Rules
                .on("mouseover", function(d) {
                    // Show the tooltip
                    toolTip.show(d);
                    // Highlight the state circle's border
                    d3.select("." + d.abbr).style("stroke", "#323232");
                })
                .on("mouseout", function(d) {
                    // Remove tooltip
                    toolTip.hide(d);
                    // Remove highlight
                    d3.select("." + d.abbr).style("stroke", "#e3e3e3");
                });
    
    // circlesGroup.selectAll("text")
    //         .data(healthData)
    //         // .enter()
    //         .append("text")
    //         .text(d => d.abbr)
    //         // .attr('x', d => xLinearScale(d[chosenXAxis]))
    //         // .attr('y', d => yLinearScale(d[chosenYAxis]))
    //         .classed("stateText", true);
      
      // Create group for  3 x- axis labels
        var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

                var horizontal1Label = labelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 20)
                .attr("value", "age") // value to grab for event listener
                .classed("active", true)
                .text("Average Age in Years");

                var horizontal2Label = labelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 40)
                .attr("value", "income") // value to grab for event listener
                .classed("inactive", true)
                .text("Average Income in Dollars");

                var horizontal3Label = labelsGroup.append("text")
                .attr("x", 0)
                .attr("y", 60)
                .attr("value", "poverty") // value to grab for event listener
                .classed("inactive", true)
                .text("Percent in Poverty");

        // Create group for  2 x- axis labels - my method for calculating thisis questionable
        //formerly:  .attr("transform", `translate(${0}, 0-${height/2})`);
        var verticalGroup = chartGroup.append("g")
        .attr("transform", `translate(${0}, ${0-height/16})`);

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
                .text("Percent who are Obese");

                var vertical3Label = verticalGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 40 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("value", "smokes")
                .classed("inactive", true)
                .attr("dy", "1em")
                .classed("axis-text", true)
                .text("Perent who Smoke");

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
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, 'x');

      //new
      textcirclesGroup = rendertextCircles(textcirclesGroup, xLinearScale, chosenXAxis, 'x');
      
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
      else if (chosenXAxis === "poverty") {
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
      else {
        alert('Axis logic did not execute');
        console.log('Axis logic did not execute');
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
      // updates y scale for new data
      yLinearScale = axisScale(healthData, chosenYAxis, 'y');

      // updates y axis with transition
      yAxis = renderAxes(yLinearScale, yAxis,'y');
    

      // updates circles with new y values
      circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis, 'y');

      //new
      textcirclesGroup = rendertextCircles(textcirclesGroup, yLinearScale, chosenYAxis, 'y');

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
      else if (chosenYAxis === 'smokes') {
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
      else {
        alert('The axis logic did not execute');
        console.log('The axis logic did not execute');
      }
    }
  
  });


});