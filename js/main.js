(function() {
  "use strict";

  var height, width, svg, widthInner; 


  // RESPONSIVE FUNCTIONS -------------------

  function getViewportDimensions() { 
    width = document.getElementsByTagName("main")[0].offsetWidth;
    height = window.innerHeight;
    height = height * 0.80;
    widthInner = width * 0.80;
  };

  getViewportDimensions();

  function drawSvg() {
    svg = d3.select("main")
      .append("svg");

      setSvgSize();
  }

  function setSvgSize() {
    svg
      .attr({
        width: width,
        height: height
      });
  }

  drawSvg();


  d3.select(window).on('resize', resize);

  function resize() {

    getViewportDimensions();
    setSvgSize();

  }

  // VISUALISATION -------------------


  function visualise(data) {

    console.log("hi");

    // rates.csv data has this date format: "2016-05-27"
    // %Y - year with century as a decimal number e.g.: 1999
    // %m - month as a decimal number e.g.: 12
    // %d - zero-padded day of the month as a decimal number e.g.: 31
    var parseDate = d3.time.format("%Y-%m-%d").parse; 

    // time
    var xScale = d3.time.scale()
      .domain(d3.extent(data, function(d) { return d.date; })) // could I simply use min and max?
      .range([0,widthInner]);

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom");

    // interest rates
    var yScale = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.rate; })])
      .range([height, 0]); 

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");

    // area generator 
    var area = d3.svg.area()
      .x(function(d) { return xScale(d.date); })
      .y0(height)
      .y1(function(d) { return yScale(d.rate); });

    data.forEach(function(d) {
      d.date = parseDate(d.date); 
      d.rate = parseFloat(d.rate).toFixed(2); 
    });

    
    console.log(data);
    console.log(d);

    svg.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Rate (%)");

  }

  // DATA -------------------
  d3.csv("data/rates.csv", function(data){
   if(data) visualise(data);

  })


})();
