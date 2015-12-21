/**
 * @file
 * @copyright Copyright (c) 2015 Palantir.net
 */

var H5P = H5P || {};

H5P.BarGraph = (function ($) {
    /**
     * Width of bars if there is no container width.
     * @constant
     * @type {number}
     */
    var DEFAULT_BAR_WIDTH = 40;

    /**
     * Default padding between bars.
     * @see css/bargraph.css
     * @constant
     * @type {number}
     */
    var DEFAULT_PADDING = 40;

    /**
     * Bar Graph Constructor.
     */
    function BarGraph(options, id) {
        var self = this;
        // Extend defaults with provided options
        this.options = $.extend(true, {}, {
            color: "56C5D0",
            dataPoints: []
        }, options);
        // Keep provided id.
        this.id = id;
    }
    
    /**
     * Calculate the width of bars based on the container size.
     */
    BarGraph.prototype.calculateBarWidth = function ($container) {
        // If we have a width, scale the bars to fit.
        var column = $container.width > 0
            ? Math.floor($container.width/this.options.dataPoints.length)
            : DEFAULT_BAR_WIDTH;
        return column - DEFAULT_PADDING;
    };

    /**
     * Attach function called by H5P framework to insert H5P content.
     *
     * @public
     * @param {jQuery} $container
     */
    BarGraph.prototype.attach = function ($container) {
        var dataPoints = this.options.dataPoints;
        var defaultColor = this.options.color;
        var margin = {top: 40, right: 20, bottom: 30, left: 40};
        var barWidth = 100;
        var width = (barWidth + 10) * dataPoints.length;
        var height = 500;
        var max = d3.max(dataPoints, function(datum) { return datum.value; });
        var x = d3.scale.linear().domain([0, dataPoints.length]).range([0, width]);
        var y = d3.scale.linear().domain([0, max]).rangeRound([0, height]);
        
        $container.addClass("bar-graph").html('');
        
        // Add the canvas to the DOM
        var chart = d3.select(".bar-graph").
            append("svg:svg").
            attr("width", width + margin.left + margin.right).
            attr("height", height + margin.top + margin.bottom).
            append("g").
            attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        // Add the chart's bars.
        chart.selectAll("rect").
            data(dataPoints).
            enter().
            append("svg:rect").
            attr("x", function(datum, index) { return x(index); }).
            attr("y", function(datum) { return height - y(datum.value); }).
            attr("height", function(datum) { return y(datum.value); }).
            attr("width", barWidth).
            attr("fill", function(datum) { return "#" + datum.barColor;});
        
        // Add the numbers to the bars.
        chart.selectAll("text").
            data(dataPoints).
            enter().
            append("svg:text").
            attr("x", function(datum, index) { return x(index) + barWidth; }).
            attr("y", function(datum) { return height - y(datum.value); }).
            attr("dx", -barWidth/2).
            attr("dy", "1.2em").
            attr("text-anchor", "middle").
            text(function(datum) { return datum.value;}).
            attr("fill", "white");
       
       // Add ticks.
       chart.selectAll("yTicks").
          data(y.ticks(10)).
          enter().append("svg:line").
          attr("x1", -5).
          // Round and add 0.5 to fix anti-aliasing effects (see above)
          attr("y1", function(d) { return ((height / max) * -d) + height}).
          attr("x2", 0).
          attr("y2", function(d) { return ((height / max) * -d) + height}).
          attr("stroke", "lightgray").
          attr("class", "yTicks");
        
        // Add text to y axis.
        chart.selectAll("text.yAxis").
            data(y.ticks(10)).
            enter().
            append("svg:text").
            text(function (d) {return d;}).
            attr("x", -10).
            attr("y", function(d) { return ((height / max) * -d) + height}).
            attr("dy", 3).
            attr("class", "yAxis").
            attr("style", "font-size: 10; font-family: Helvetica, sans-serif").
            attr("text-anchor", "end");
        
        // Add text to x axis.
        chart.selectAll("text.xAxis").
            data(dataPoints).
            enter().append("svg:text").
            attr("x", function(datum, index) { return x(index) + barWidth; }).
            attr("y", height).
            attr("dx", -barWidth/2).
            attr("text-anchor", "middle").
            attr("style", "font-size: 12; font-family: Helvetica, sans-serif").
            text(function(datum) { return datum.name;}).
            attr("transform", "translate(0, 18)").
            attr("class", "yAxis");
    };

    return BarGraph;
})(H5P.jQuery);

