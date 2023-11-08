import {
    pointer,
    scaleLinear,
    axisBottom,
    axisLeft,
    line,
    select,
    min,
    max,
    curveCardinal,
    bisector
} from 'd3';
import {interpolateRainbow} from 'd3-scale-chromatic';

export function createLineChart(data, lineChartElement) {
    const margin = {
        top: 20, right: 20, bottom: 30, left: 50
    };
    const width = 960 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const xScale = scaleLinear()
        .domain([min(data, d => d[0]), max(data, d => d[0])])
        .range([0, width]);

    const yScale = scaleLinear()
        .domain([min(data, d => d[1]), max(data, d => d[1])])
        .range([height, 0]);

    const svg = select(lineChartElement)
        .style('font', '15px sans-serif')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const lin = line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1]))
        .curve(curveCardinal);

    const path = svg.append('path')
        .data([data])
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 4)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', lin);

    svg.append('defs')
        .append('marker')
        .attr('id', 'dot')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 5)
        .attr('refY', 5)
        .attr('markerWidth', 2)
        .attr('markerHeight', 2)
        .attr('orient', 'auto-start-reverse')
        .append('circle')
        .attr('cx', 5)
        .attr('cy', 5)
        .attr('r', 5)
        .style('fill', 'grey');

    return {
        withAnimation: withAnimation(path),
        createXAxis: createXAxis(svg, xScale, height),
        createYAxis: createYAxis(svg, yScale),
        withFocus: withFocus(svg, width, height, xScale, data, yScale)
    };
}


function withFocus(svg, width, height, xScale, data, yScale) {
   return function () {
       const bisect = bisector(d => d[0]).left;
       const focus = svg.append('g')
           .style('display', 'none');

       focus.append('line')
           .attr('class', 'x')
           .style('stroke', 'blue')
           .style('stroke-dasharray', '3,3')
           .style('opacity', 0.5)
           .attr('y1', 0)
           .attr('y2', height);

       focus.append('line')
           .attr('class', 'y')
           .style('stroke', 'blue')
           .style('stroke-dasharray', '3,3')
           .style('opacity', 0.5)
           .attr('x1', width)
           .attr('x2', width);

       focus.append('circle')
           .attr('class', 'circle')
           .style('fill', 'none')
           .style('stroke', 'steelblue')
           .attr('stroke-width', 3)
           .attr('r', 4);

       const tooltip = svg.append('g')
           .attr('class', 'tooltip')
           .style('opacity', 0);

       const tooltipRect = tooltip.append('rect')
           .attr('y', -22)
           .attr('rx', 15)
           .attr('ry', 15)
           .style('fill', '#fff')
           .style('stroke', '#ccc')
           .style('opacity', 0.8);

       const tooltipText = tooltip.append('text')
           .attr('class', 'tooltip-text')
           .attr('y', 0)
           .style('text-anchor', 'start')
           .attr('font-size', '12px')
           .attr('font-family', 'sans-serif');

       function calculateFocusPosition(event) {
           const xZero = xScale.invert(pointer(event)[0]);
           const index = bisect(data, xZero, 1);
           const xValue = data[index - 1];
           const yValue = data[index];

           if (!yValue || !xValue) {
               return;
           }

           const focusPosition = xZero - xValue[0] > yValue[0] - xZero ? yValue : xValue;

           focus.select('.circle')
               .attr('transform', `translate(${xScale(focusPosition[0])}, ${yScale(focusPosition[1])})`);

           focus.select('.x')
               .attr('transform', `translate(${xScale(focusPosition[0])}, 0)`)
               .attr('y2', height);

           focus.select('.y')
               .attr('transform', `translate(${width}, ${yScale(focusPosition[1])})`)
               .attr('x1', -width);

           tooltipText.html(`x: ${focusPosition[0]} y: ${focusPosition[1]}`);

           const bbox = tooltipText.node().getBBox();

           tooltipRect
               .attr('width', bbox.width + 20)
               .attr('height', bbox.height + 10)
               .attr('x', bbox.x - 10)
               .attr('y', bbox.y - 5);

           let xPos = xScale(focusPosition[0]) + 30;
           let yPos = yScale(focusPosition[1]);
           const tooltipWidth = bbox.width + 20;
           const tooltipHeight = bbox.height + 20;

           if ((xPos + tooltipWidth) > width) {
               xPos = xScale(focusPosition[0]) - 30 - tooltipWidth;
           }

           if ((yPos + tooltipHeight) > height) {
               yPos = yScale(focusPosition[1]) - tooltipHeight;
           }

           tooltip
               .attr('transform', `translate(${xPos}, ${yPos})`);

           tooltip.transition().duration(100)
               .style('opacity', .9);
       }

       svg.append('rect')
           .attr('width', width)
           .attr('height', height)
           .style('fill', 'none')
           .style('pointer-events', 'all')
           .on('mouseover', () => focus.style('display', null))
           .on('mouseout', () => {
               focus.style('display', 'none');
               tooltip.style('opacity', 0);
           })
           .on('mousemove', calculateFocusPosition);
   }
}

function createXAxis(svg, xScale , height) {
    return function () {
        createAxis(axisBottom(xScale), svg)
            .attr('class', 'x axis')
            .attr('transform', `translate(0,${height})`);

        return this;
    }
}

function createYAxis(svg, yScale) {
    return function () {
        createAxis(axisLeft(yScale), svg);

        return this;
    }
}

function createAxis(scale, svg) {
    const axis = svg.append('g')
        .call(scale.ticks(5));

    axis
        .selectAll('text')
        .style('stroke', 'grey')
        .style('fill', d => interpolateRainbow(d / 40))
        .style('font-size', '12px')
        .style('font-weight', 'bold');

    axis
        .selectAll('line')
        .style('stroke-width', '3px')
        .style('stroke-dasharray', '5,5');

    axis
        .selectAll('.tick')
        .append('circle')
        .attr('r', 5)
        .style('fill', d => interpolateRainbow(d / 40))
        .style('stroke', 'none')
        .attr('cy', 0);


    svg.selectAll('.domain')
        .attr('stroke', 'grey')
        .attr('stroke-width', 3)
        .attr('stroke-linecap', 'round');
    return axis;
}

function withAnimation(path) {
    return function () {
        const totalLength = path.node().getTotalLength();
        path
            .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .attr('stroke-dashoffset', 0);

        return this;
    }
}