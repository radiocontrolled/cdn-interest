(function() {
  "use strict";

  var height, width, svg, xScale, xAxis, yScale, area, yAxis, yAxisPretty, margin = {top: 20, right: 20, bottom: 30, left: 40};
  
  // RESPONSIVE FUNCTIONS -------------------

  function getViewportDimensions() { 

    width = document.getElementsByTagName("main")[0].offsetWidth;
    height = window.innerHeight * 0.5;
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;


  }

  getViewportDimensions();

  function drawSvg() {
    svg = d3.select("main")
      .append("svg");
      setSvgSize();
      
  }

  function setSvgSize() {

    svg
      .attr({
        width: function() {
          return width + margin.left + margin.right; 
        },
        height: function() {
          return height + margin.top + margin.bottom; 
        }
      });


    
  }

  drawSvg();

  // VISUALISATION -------------------

  function visualise(data) {

    svg = svg.append("g")
      .attr({
        "class": "holder",
        "transform": function() {
          return "translate(" + margin.left + "," + margin.top + ")";
        }
      });

    // rates.csv date format: "2016-05-27"
    // %Y - year with century as a decimal number e.g.: 1999
    // %m - month as a decimal number e.g.: 12
    // %d - zero-padded day of the month as a decimal number e.g.: 31
      
    var parseDate = d3.time.format("%Y-%m-%d").parse; 

    // time
    xScale = d3.time.scale()
      .range([0,width]);

    xAxis = d3.svg.axis()
      .ticks(10)
      .scale(xScale)
      .orient("bottom");

    // interest rates
    yScale = d3.scale.linear()
      .range([height, 0]); 

    yAxis = d3.svg.axis()
      .ticks(7)
      .scale(yScale)
      .orient("left");

    yAxisPretty = d3.svg.axis()
      .scale(yScale)
      .orient("left");

    // area generator 
    area = d3.svg.area()
      .x(function(d) { return xScale(d.date); })
      .y0(height)
      .y1(function(d) { return yScale(d.rate); });

    data.forEach(function(d) {
      d.date = parseDate(d.date); 
      d.rate = parseFloat(d.rate).toFixed(2); 
    });

    xScale 
      .domain(d3.extent(data, function(d) { return d.date; })); // could I simply use min and max?

    yScale
      .domain([0, d3.max(data, function(d) { return d.rate; })]);
       
    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);
       
    // svg
    //   .append("g")         
    //   .attr("class", "grid")

    //   .call(yAxis
    //     .tickSize(-width, 0, 0)
    //     .tickFormat("")
    //   );

    svg
      .append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

    svg
      .append("g")
      .attr("class", "y axis pretty")
      .call(yAxisPretty);

    svg
      .append("g")
      .attr({
        "class": "x axis",
        "transform":"translate(0," + height + ")"
      })
      .call(xAxis);

    svg
      .append("text")
      .attr({
        "transform": "rotate(-90)",
        "y": 2, 
        "x":-5,
        "dy":"1em"
      })
      .style("text-anchor", "end")
      .text("%");      
  }

  // DATA -------------------
  var q = d3_queue.queue();

  q
    .defer(d3.csv, "data/rates.csv") 
    .await(function(error, data) { 
      if(error){
        console.log("error");
      }
      else{
        visualise(data);
      }
    });

  d3.select(window).on('resize', resize);

  function resize() {

    getViewportDimensions();
   
    svg = d3.select("svg");
    setSvgSize();

    // xAxis
    xScale 
      .range([0,width]);

    xAxis
      .scale(xScale);

    d3.select(".x")
      .attr({
        "transform":"translate(0," + height + ")"
      })
      .call(xAxis);

    // yAxis
    yScale
      .range([height, 0]); 

    yAxis 
      .scale(yScale);

    d3.select(".y").call(yAxis);


    // yAxisPretty

    yAxisPretty 
      .scale(yScale);

   d3.select(".pretty").call(yAxisPretty);

    // horizontal gridlines 

  
    // d3.select(".grid")
    //  .call(yAxis
    //     .tickSize(-width, 0, 0)
    //     .tickFormat("")
    //   );



    area 
      .x(function(d) { return xScale(d.date); })
      .y0(height)
      .y1(function(d) { return yScale(d.rate); });


    d3.select("path.area")
      .attr("d", area);


    d3.select(".holder")
      .attr({
        "transform": function() {
          return "translate(" + margin.left + "," + margin.top + ")";
        }
      });
  


  }


})();
