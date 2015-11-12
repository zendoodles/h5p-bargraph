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
            color: "064771",
            dataPoints: []
        }, options);
        // Keep provided id.
        this.id = id;

        /**
         * Calculate the width of bars based on the container size.
         */
        this.calculateBarWidth = function ($container) {
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
        this.attach = function ($container) {
            var dataPoints = self.options.dataPoints;
            var defaultColor = self.options.color;

            $container.addClass("bar-graph").html('');

            var barWidth = 400;
            var width = (barWidth + 10) * dataPoints.length;
            var height = 2000;

            var x = d3.scale.linear().domain([0, dataPoints.length]).range([0, width]);
            var y = d3.scale.linear().domain([0, d3.max(dataPoints, function(datum) { return datum.value; })]).
                rangeRound([0, height]);

            // Add the canvas to the DOM
            var chart = d3.select(".bar-graph").
                append("svg:svg").
                attr("width", width).
                attr("height", height);

            chart.selectAll("rect").
                data(dataPoints).
                enter().
                append("svg:rect").
                attr("x", function(datum, index) { return x(index); }).
                attr("y", function(datum) { return height - y(datum.value); }).
                attr("height", function(datum) { return y(datum.value); }).
                attr("width", barWidth).
                attr("fill", "#" + defaultColor);

            // Add the numbers to the bars.
            chart.selectAll("text").
                data(dataPoints).
                enter().
                append("svg:text").
                attr("x", function(datum, index) { return x(index) + barWidth; }).
                attr("y", function(datum) { return height - y(datum.name); }).
                attr("dx", -barWidth/2).
                attr("dy", "1.2em").
                attr("text-anchor", "middle").
                text(function(datum) { return datum.name;}).
                attr("fill", "white");
        };
    }

    return BarGraph;
})(H5P.jQuery);

