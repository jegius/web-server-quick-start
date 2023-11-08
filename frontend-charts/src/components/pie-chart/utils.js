import {arc, pie, scaleSequential, select} from 'd3';
import {interpolateRainbow} from 'd3-scale-chromatic';

export function createPieChart(data, pieChartElement) {
    const pieGenerator = pie().value(d => d.weight);
    const color = scaleSequential(interpolateRainbow).domain([0, data.length]);
    const containerWidth = pieChartElement.getBoundingClientRect().width;
    const pieDiameter = Math.min(containerWidth, window.innerHeight);
    const {arcGenerator, arcGeneratorSmall, arcGeneratorHover, arcGeneratorStart} = createGenerators(pieDiameter);

    const svg = select(pieChartElement)
        .append('svg')
        .attr('viewBox', `0 0 ${pieDiameter} ${pieDiameter}`);

    const g = svg
        .append('g')
        .attr('transform', `translate(${pieDiameter / 2}, ${pieDiameter / 2})`);

    const path = g.selectAll('path')
        .data(pieGenerator(data))
        .enter()
        .append('path')
        .attr('id', (d, i) => `path-${i}`)
        .attr('class', 'path')
        .attr('d', arcGeneratorStart)
        .attr('fill', (_, i) => color(i));
    path
        .transition()
        .duration(1000)
        .attr('d', arcGenerator);


    const defs = svg.append('defs');
    const filter = defs
        .append('filter')
        .attr('id', 'drop-shadow');
    filter
        .append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 3);
    filter
        .append('feOffset')
        .attr('dx', 2)
        .attr('dy', 2)
        .attr('result', 'offsetblur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    function withSelectAction() {
        path.on('click', function () {
            const alreadyHaveClass = select(this).classed('active');

            g.selectAll('.path')
                .classed('active', false)
                .style('stroke', null)
                .style('stroke-width', null)
                .style('stroke-dasharray', null);

            select(this)
                .classed('active', !alreadyHaveClass)
                .transition()
                .attr('d', arcGeneratorHover)
                .style('stroke', !alreadyHaveClass ? 'grey' : null)
                .style('stroke-width', !alreadyHaveClass ? '3px' : null)
                .style('stroke-dasharray', !alreadyHaveClass ? '6px' : null);
        });
        return this;
    }

    function withHoverActions() {
        const tooltip = select('.tooltip');

        g.on('mouseout', function () {
            g.selectAll(`path`)
                .filter(function () {
                    return !select(this).classed('active');
                })
                .transition()
                .attr('d', arcGenerator);

            tooltip
                .style('opacity', 0);
        });

        path.on('mouseout', function () {
            select(this)
                .attr('transform', 'translate(0, 0)')
                .style('filter', null)
                .filter(function () {
                    return !select(this).classed('active');
                })
                .transition()
                .attr('d', arcGenerator);
        });

        path.on('mouseover', function (event, d) {
            const [mx, my] = arcGenerator.centroid(d);
            const offset = 5;

            select(this)
                .attr('transform', `translate(${mx / offset}, ${my / offset})`)
                .filter(function () {
                    return !select(this).classed('active');
                })
                .style('filter', 'url(#drop-shadow)')
                .transition()
                .attr('d', arcGeneratorHover);

            g.selectAll('.path')
                .filter(function () {
                    return !select(this).classed('active');
                })
                .filter(({index}) => `path-${index}` !== event.target.id)
                .transition()
                .attr('d', arcGeneratorSmall);

            tooltip
                .style('left', `${event.pageX + 10}px`)
                .style('top', `${event.pageY + 10}px`)
                .style('opacity', 1)
                .html(`<ul> 
                    <li>${d.data.name}</li>
                    <li>${d.data.weight}</li>
                </ul>`);

            path.on('mousemove', function (event) {
                tooltip
                    .style('left', `${event.pageX + 10}px`)
                    .style('top', `${event.pageY + 10}px`);
            });
        });

        return this;
    }

    function withTooltip() {
        select('body')
            .append('div')
            .classed('tooltip', true)
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('padding', '.5rem')
            .style('border-radius', '.2rem')
            .style('pointer-events', 'none')
            .style('opacity', 0);

        return this;
    }

    return {
        withTooltip,
        withHoverActions,
        withSelectAction
    };
}

function createGenerators(pieDiameter) {
    const arcGenerator = arc()
        .innerRadius(0)
        .outerRadius(pieDiameter / 3);

    const arcGeneratorSmall = arc()
        .innerRadius(0)
        .outerRadius((pieDiameter / 3) * 0.8);

    const arcGeneratorStart = arc()
        .innerRadius(0)
        .outerRadius((pieDiameter / 100) * 0.1);

    const arcGeneratorHover = arc()
        .innerRadius(0)
        .outerRadius((pieDiameter / 3) * 1.2);

    return {
        arcGenerator,
        arcGeneratorSmall,
        arcGeneratorHover,
        arcGeneratorStart
    };
}