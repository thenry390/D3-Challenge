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

// Create an SVG wrapper, append an SVG group that will hold our scatter graph,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var graphGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
      d3.max(data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "poverty") {
    label = "In Poverty (%):";
  }
  else {
    label = "Healthcare Coverage (%):";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("./assets/data/data.csv").then(function(data, err) {
  if (err) throw err;
 
  // parse data
  data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(data, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = graphGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  graphGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = graphGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 13)
    .attr("fill", "blue")
    .attr("opacity", ".7");
    // .append("text")
    // .attr("x", d => xLinearScale(d[chosenXAxis]))
    // .attr("y", d => yLinearScale(d.healthcare))
    // .text(d =>d.abbr);

  // Create group for two x-axis labels
  var labelsGroup = graphGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  // append y axis
  graphGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "3em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

}).catch(function(error) {
  console.log(error);
});

//extra credit version below

// var svgWidth = 960;
// var svgHeight = 500;

// var margin = {
//   top: 20,
//   right: 40,
//   bottom: 80,
//   left: 100
// };

// var width = svgWidth - margin.left - margin.right;
// var height = svgHeight - margin.top - margin.bottom;

// // Create an SVG wrapper, append an SVG group that will hold our scatter graph,
// // and shift the latter by left and top margins.
// var svg = d3
//   .select(".chart")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);

// // Append an SVG group
// var graphGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Initial Params
// var chosenXAxis = "poverty";
// var chosenYAxis = "healthcare";

// // function used for updating x-scale var upon click on axis label
// function xScale(data, chosenXAxis) {
//   // create scales
//   var xLinearScale = d3.scaleLinear()
//     .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
//       d3.max(data, d => d[chosenXAxis]) * 1.2
//     ])
//     .range([0, width]);

//   return xLinearScale;

// }
// // function used for updating x-scale var upon click on axis label
// function yScale(data, chosenYAxis) {
//   // create scales
//   var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
//       d3.max(data, d => d[chosenYAxis]) * 1.2
//     ])
//     .range([0, width]);

//   return yLinearScale;

// }
// // function used for updating xAxis var upon click on axis label
// function renderXAxes(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return xAxis;
// }

// // function used for updating xAxis var upon click on axis label
// function renderYAxes(newYScale, yAxis) {
//   var bottomAxis = d3.axisBottom(newYScale);

//   yAxis.transition()
//     .duration(1000)
//     .call(bottomAxis);

//   return yAxis;
// }
// // function used for updating circles group with a transition to
// // new circles
// function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newXScale(d[chosenXAxis]));

//   return circlesGroup;
// }
// function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

//   circlesGroup.transition()
//     .duration(1000)
//     .attr("cx", d => newYScale(d[chosenYAxis]));

//   return circlesGroup;
// }
// // function used for updating circles group with new tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {

//   var label;

//   if (chosenXAxis === "poverty") {
//     label = "In Poverty (%):";
//   }
//   else if (chosenXAxis === "age") {
//     label = "Age Median (%):";
//   }
//   else {
//     label = "Household Median Income (%):";
//   }
// // function used for updating circles group with new tooltip
// function updateToolTip(chosenYAxis, circlesGroup) {

//   var label;

//   if (chosenYAxis === "healthcare") {
//     label = "Healthcare Coverage (%):";
//   }
//   else if (chosenYAxis === "smokes") {
//     label = "Smokes (%):";
//   }
//   else {
//     label = "Obese (%):";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.abbr}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }
// console.log("just before d3.csv");
// // Retrieve data from the CSV file and execute everything below
// d3.csv("./assets/data/data.csv").then(function(data, err) {
//   if (err) throw err;
//  console.log("inside d3.csv");
//   // parse data
//   data.forEach(function(data) {
//     data.poverty = +data.poverty;
//     data.healthcare = +data.healthcare;
//     data.poverty = +data.smokes;
//     data.healthcare = +data.obesity;
//     data.poverty = +data.age;
//     data.healthcare = +data.income;
//   });
// console.log(data);
//   // xLinearScale function above csv import
//   var xLinearScale = xScale(data, chosenXAxis);

//   // Create y scale function
//   var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(data, d => d.healthcare)])
//     .range([height, 0]);

//   // Create initial axis functions
//   var bottomAxis = d3.axisBottom(xLinearScale);
//   var leftAxis = d3.axisLeft(yLinearScale);

//   // append x axis
//   var xAxis = graphGroup.append("g")
//     .classed("x-axis", true)
//     .attr("transform", `translate(0, ${height})`)
//     .call(bottomAxis);

//   // append y axis
//   graphGroup.append("g")
//     .call(leftAxis);

//   // append initial circles
//   var circlesGroup = graphGroup.selectAll("circle")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("cx", d => xLinearScale(d[chosenXAxis]))
//     .attr("cy", d => yLinearScale(d.healthcare))
//     .attr("r", 10)
//     .attr("fill", "blue")
//     .attr("opacity", "1");

//   // Create group for two x-axis labels
//   var xlabelsGroup = graphGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);

//   var povertyLabel = xlabelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "poverty") // value to grab for event listener
//     .classed("active", true)
//     .text("In Poverty (%)");

//   var ageLabel = xlabelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 40)
//     .attr("value", "age") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Age Median (%)");  
    
//   var incomeLabel = xlabelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 60)
//     .attr("value", "income") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Household Income Median (%)");

//   // Create group for two y-axis labels
//   var ylabelsGroup = graphGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);

//   var healthcareLabel = ylabelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 0)
//     .attr("value", "healthcare") // value to grab for event listener
//     .classed("active", true)
//     .text("Lacks Healthcare (%)");

//   var smokesLabel = ylabelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 10)
//     .attr("value", "smokes") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Smokes (%)");  
    
//   var obeseLabel = ylabelsGroup.append("text")
//     .attr("x", 0)
//     .attr("y", 20)
//     .attr("value", "obesity") // value to grab for event listener
//     .classed("inactive", true)
//     .text("Obese (%)");


//   // append y axis
//   graphGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "3em")
//     .classed("axis-text", true)
//     .text("Lacks Healthcare (%)");

//   // append y axis
//   graphGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "2em")
//     .classed("axis-text", true)
//     .text("Smokes (%)");

//   // append y axis
//   graphGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Obese (%)");

//   // updateToolTip function above csv import
//   var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
 
//   // x axis labels event listener
//   xlabelsGroup.selectAll("text")
//     .on("click", function() {
//       // get value of selection
//       var value = d3.select(this).attr("value");
//       if (value !== chosenXAxis) {

//         // replaces chosenXAxis with value
//         chosenXAxis = value;

//         // console.log(chosenXAxis)

//         // functions here found above csv import
//         // updates x scale for new data
//         xLinearScale = xScale(data, chosenXAxis);

//         // updates x axis with transition
//         xAxis = renderXAxes(xLinearScale, xAxis);

//         // updates circles with new x values
//         circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

//         // updates tooltips with new info
//         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

//         // changes classes to change bold text
//         if (chosenXAxis === "poverty") {
//           ageLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           incomeLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           povertyLabel
//             .classed("active", false)
//             .classed("inactive", true);
//         }
//         else if(chosenXAxis === "age") {
//           ageLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           incomeLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           povertyLabel
//             .classed("active", true)
//             .classed("inactive", false);        }
//         else {
//           ageLabel
//             .classed("active", true)
//             .classed("inactive", false);
//           incomeLabel
//             .classed("active", false)
//             .classed("inactive", true);
//           povertyLabel
//             .classed("active", true)
//             .classed("inactive", false);
//         }
//       }
//     });

//  // updateToolTip function above csv import
//  var circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

//   // y axis labels event listener
//   ylabelsGroup.selectAll("text")
//   .on("click", function() {
//     // get value of selection
//     var value = d3.select(this).attr("value");
//     if (value !== chosenYAxis) {

//       // replaces chosenXAxis with value
//       chosenYAxis = value;

//       // console.log(chosenXAxis)

//       // functions here found above csv import
//       // updates x scale for new data
//       yLinearScale = yScale(data, chosenYAxis);

//       // updates x axis with transition
//       yAxis = renderYAxes(yLinearScale, yAxis);

//       // updates circles with new x values
//       circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

//       // updates tooltips with new info
//       circlesGroup = updateToolTip(chosenYAxis, circlesGroup);

//       // changes classes to change bold text
//       if (chosenYAxis === "healthcare") {
//         obeseLabel
//           .classed("active", true)
//           .classed("inactive", false);
//         smokesLabel
//           .classed("active", true)
//           .classed("inactive", false);
//         healthcareLabel
//           .classed("active", false)
//           .classed("inactive", true);
//       }
//       else if(chosenYAxis === "smokes") {
//         obeseLabel
//           .classed("active", true)
//           .classed("inactive", false);
//         smokesLabel
//           .classed("active", false)
//           .classed("inactive", true);
//         healthcareLabel
//           .classed("active", true)
//           .classed("inactive", false);        }
//       else {
//         obeseLabel
//           .classed("active", false)
//           .classed("inactive", true);
//         smokesLabel
//           .classed("active", true)
//           .classed("inactive", false);
//         healthcareLabel
//           .classed("active", true)
//           .classed("inactive", false);
//       }
//     }
//   });
// }).catch(function(error) {
//   console.log(error);
// });
// }
