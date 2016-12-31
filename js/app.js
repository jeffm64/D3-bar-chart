$(document).ready(function() {
 
  var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
  
  var margin = {top: 80, right: 80, bottom: 80, left: 110};

  var canvas = document.getElementById('chart').getBoundingClientRect();
  
  //width and height of the chart
  var w = canvas.width - margin.left - margin.right;
  var h = canvas.height - margin.top - margin.bottom;

  //creates the chart svg
  var svg = d3.select(".chart")
              .append("svg")
              .attr("width", w + margin.left + margin.right)
              .attr("height", h + margin.top + margin.bottom)
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  
  //gets the json data needed for the chart
  d3.json(url, function(data) {
    
    if ($(window).width() < 900) {
         $(".x-axis text").hide();
      }
      else {
         $(".x-axis text").show();
      };
   
    //this is where all the main data is located
    var mainData = data.data
    
    //finds earliest date in chart
    var minDate = d3.min(mainData, function(d, i) {
      //turns date into just date as an integer
      return parseFloat(mainData[i][0].slice(0, 4));
    });
    
    //finds latest date in chart
    var maxDate = d3.max(mainData, function(d, i) {
      //turns date into just date as an integer
      return parseFloat(mainData[i][0].slice(0, 4));
    });
    
    //finds domain max number
    var max = d3.max(mainData, function(d) {
      return d[1];
    });
    
    
    //updates chart upon resize
    d3.select(window)
    .on("resize", function() {
      
      if ($(window).width() < 900) {
         $(".x-axis text").hide();
      }
      else {
         $(".x-axis text").show();
      };
      
      canvas = document.getElementById('chart').getBoundingClientRect();
      w = canvas.width - margin.left - margin.right;
      h = canvas.height - margin.top - margin.bottom;
      
      minDate = d3.min(mainData, function(d, i) {
      //turns date into just date as an integer
      return parseFloat(mainData[i][0].slice(0, 4));
    });
    
    //finds latest date in chart
    maxDate = d3.max(mainData, function(d, i) {
      //turns date into just date as an integer
      return parseFloat(mainData[i][0].slice(0, 4));
    });
    
    //finds domain max number
    max = d3.max(mainData, function(d) {
      return d[1];
    });
    
      d3.select("svg")
         .attr("width", w + margin.left + margin.right)
         .attr("height", h + margin.top + margin.bottom)
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
      xScale = d3.scaleBand()
          .domain(d3.range(mainData.length))
          .range([0, w]);
      
      xScale2 = d3.scaleLinear()
          .domain([minDate, maxDate])
          .range([0, w]);
      
      yScale = d3.scaleLinear()
          .domain([0, max])
          .range([0, h]);
      
      yScale2 = d3.scaleLinear()
          .domain([0, max])
          .range([h, 0]);
    
      xAxis = d3.axisBottom(xScale2)
                .ticks(20, 5);
    
      yAxis = d3.axisLeft(yScale2)
                .ticks(10);
      
      svg.selectAll("rect")
     .data(mainData)
     .attr("x", function(d, i) {
        return xScale(i);
      })
     .attr("y", function(d) {
        return h - yScale(d[1]);
     })
     .attr("width", xScale.bandwidth())
     .attr("height", function(d) {
        return yScale(d[1]);
     })
      
     //creates x axis and label
    svg.select(".x-axis")
        .attr("transform", "translate(0," + (h) + ")")
        .call(xAxis);
      
    svg.select(".x-axis-label")
        .attr("transform", "translate(" + (w / 2) + " ," + (h * 1.15) + ")")
        .style("text-anchor", "middle")
        .text("Year");
    
    //creates y axis and label
    svg.select(".y-axis")
        .attr("transform", "translate(0, 0)")
        .call(yAxis);
  });
   
  
  //scales x in ordinal form
  var xScale = d3.scaleBand()
          .domain(d3.range(mainData.length))
          .range([0, w]);
  
  //for setting up the axis
  var xScale2 = d3.scaleLinear()
          .domain([minDate, maxDate])
          .range([0, w]);


  //scales y  in linear form
  var yScale = d3.scaleLinear()
          .domain([0, max])
          .range([0, h]);
    
  //for setting up the axis  
  var yScale2 = d3.scaleLinear()
          .domain([0, max])
          .range([h, 0]);
    
  var xAxis = d3.axisBottom(xScale2)
                .ticks(20, 5);
    
  var yAxis = d3.axisLeft(yScale2)
                .ticks(10);

  //Create bars
  svg.selectAll("rect")
     .data(mainData)
     .enter()
     .append("rect")
     .attr("x", function(d, i) {
        return xScale(i);
      })
     .attr("y", function(d) {
        return h - yScale(d[1]);
     })
     .attr("width", xScale.bandwidth())
     .attr("height", function(d) {
        return yScale(d[1]);
     })
     .on("mouseover", function(d) {
        //Get hovered bar's x/y values, then work it for the tooltip
        var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 6;
        var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h / 2;
    
        //changes tooltip position and amount
        d3.select("#tooltip")
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px")
          .select(".amount")
          .text(d[1]);
    
        //changes date of tooltip
        d3.select("#tooltip")
          .select(".date")
          .text(d[0]);
    
        //show tooltip
        d3.select("#tooltip").classed("hidden", false);
    
     })
     .on("mouseout", function() {
      //Hide the tooltip
      d3.select("#tooltip").classed("hidden", true);

     });
     
    //creates x axis and label
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + (h) + ")")
        .call(xAxis);
    
    svg.append("text")
        .attr("transform", "translate(" + (w / 2) + " ," + (h * 1.15) + ")")
        .attr("class", "x-axis-label")
        .style("text-anchor", "middle")
        .text("Year");
    
    //creates y axis
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(0, 0)")
        .call(yAxis);   
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "y-axis-label")
        .attr("y", (0 - margin.left))
        .attr("x", 0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("GDP");
    
  });

					
    
      




  
  
  
 
  


  
});