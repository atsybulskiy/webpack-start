interface JQuery {
    sparkline(values?: number[], options?: SparklineOptions): JQuery;
}

interface SparklineOptions {
    type?: 'line' | 'bar' | 'tristate' | 'discrete' | 'bullet' | 'pie' | 'box';
    width?: 'auto' | string;     // Width of the chart - Defaults to 'auto' - May be any valid css width - 1.5em, 20px, etc (using a number without a unit specifier won't do what you want) - This option does nothing for bar and tristate chars (see barWidth)
    height?: 'auto' | number;    // Height of the chart - Defaults to 'auto' (line height of the containing tag)
    lineColor?: string;
    fillColor?: string | false;
    // chartRangeMin	Specify the minimum value to use for the range of Y values of the chart - Defaults to the minimum value supplied
    // chartRangeMax	Specify the maximum value to use for the range of Y values of the chart - Defaults to the maximum value supplied
    // composite	If true then don't erase any existing chart attached to the tag, but draw another chart over the top - Note that width and height are ignored if an existing chart is detected.
    // Note: You'll usually want to lock the axis on both charts using chartRangeMin and chartRangeMax if you want the same value on each chart to occupy the same point.
    // enableTagOptions	If true then options can be specified as attributes on each tag to be transformed into a sparkline, as well as passed to the sparkline() function. See also tagOptionPrefix
    // tagOptionPrefix	String that each option passed as an attribute on a tag must begin with. Defaults to 'spark'
    // tagValuesAttribute	The name of the tag attribute to fetch values from, if present - Defaults to 'values'
    // disableHiddenCheck

    // defaultPixelsPerValue	Defaults to 3 pixels of width for each value in the chart
    spotColor?: string | false;
    minSpotColor?: string | false;
    maxSpotColor?: string | false;
    spotRadius?: number;
    // valueSpots	Specifies which points to draw spots on, and with which colour. Accepts a range. For example, to render green spots on all values less than 50 and red on values higher use {':49': 'green, '50:': 'red'}
    // - New in 2.0
    highlightSpotColor?: string | null;
    highlightLineColor?: string | null;
    lineWidth?: number;
    // normalRangeMin, normalRangeMax	Specify threshold values between which to draw a bar to denote the "normal" or expected range of values. For example the green bar here  might denote a normal operating temperature range
    // drawNormalOnTop	By default the normal range is drawn behind the fill area of the chart. Setting this option to true causes it to be drawn over the top of the fill area
    // xvalues	See below
    // chartRangeClip	If true then the y values supplied to plot will be clipped to fall between chartRangeMin and chartRangeMax - By default chartRangeMin/Max just ensure that the chart spans at least that range of values, but does not constrain it
    // chartRangeMinX	Specifies the minimum value to use for the X value of the chart
    // chartRangeMaxX

    /**
     * Set to true to disable all sparkline interactivity,
     * making the plugin behave in much the same way as it did in 1.x
     * @default false
     */
    disableInteraction?: boolean;

    /** Set to true to disable mouseover tooltips.
     * @default false
     */
    disableTooltips?: boolean;

    // disableHighlight	Set to true to disable the highlighting of individual values when mousing over a sparkline.
    // Defaults to false
    // highlightLighten	Controls the amount to lighten or darken a value when moused over. A value of 1.5 will lighten by 50%, 0.5 will darken by 50%.
    // Defaults to 1.4
    // highlightColor	If specified, then values that are moused over will be changed to this colour instead of being lightend
    // tooltipContainer	Specifies the DOM element that tooltips should be rendered into.
    // Defaults to document.body
    // tooltipClassname	Specifies a CSS class name to apply to tooltips to override the default built-in style.
    // tooltipOffsetX	Specifies how many pixels away from the mouse pointer to render the tooltip on the X axis
    // tooltipOffsetY	Specifies how many pixels away from the mouse pointer to render the tooltip on the Y axis
    // tooltipFormatter	Pass a javascript function to use as a callback to override the HTML used to generate tooltips. The callback will be passed arguments of (sparkline, options, fields).
    // sparkline is the sparkline object being rendered, "options" is the key:value mapping of options set for this sparkline - use options.get(key, default) to fetch an individual option. "fields" is an array of fields to render for the sparkline. This will be a single element array unless its a box plot.
    // tooltipChartTitle	If specified then the tooltip uses the string specified by this setting as a title
    // tooltipFormat	A format string or spformat object (or an array thereof for multiple entries) to control the format of the tooltip
    // tooltipPrefix	A string to prepend to each field displayed in a tooltip
    // tooltipSuffix	A string to append to each field displayed in a tooltip
    // tooltipSkipNull	If true then null values will not have a tooltip displayed
    // Defaults to true
    // tooltipValueLookups	An object or range map to map field values to tooltip strings. For example you may want to map -1, 0 and 1 to the strings "Lost", "Draw", "Won"
    // tooltipFormatFieldlist	An array of values specifying which fields to display in a tooltip and in what order. Currently only useful for box plots. See below for more details
    // tooltipFormatFieldlistKey	Specifies which key holds the field name to reference above. For box plots this should be "field"
    // numberFormatter	Pass a javascript function to control how numbers are formatted in tooltips. The callback will be passwd a number to format and must return a string.
    // Default behaviour is to format numbers to western conventions.
    // numberDigitGroupSep	Character to use for group separator in numbers "1,234" for l10n purposes.
    // Defaults to the comma - ","
    // numberDecimalMark	Character to use for the decimal point in numbers for l10n purposes.
    // Defaults to the period - "."
    // numberDigitGroupCount	Number of digits between the group seperator in numbers for l10n purposes.
    // Defaults to 3.
}
