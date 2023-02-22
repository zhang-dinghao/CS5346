const dms = {
    width: 900,
    height: 500,
    margin: {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    }
}

dms.contentWidth = dms.width - dms.margin.left - dms.margin.right
dms.contentHeight = dms.height - dms.margin.top - dms.margin.bottom

const box = d3.select('#box-div').append('svg')
    .attr('id', 'box')
    .attr('width', dms.width)
    .attr('height', dms.height)


const content = box.append('g')
    .attr('id', 'content')
    .style('transform', `translate(${dms.margin.left}px,${dms.margin.top}px)`)

const yesLine = content.append('g')
    .attr('id', 'yes-line')


const dateAxis = content.append('g')
    .attr('id', 'date-axis')
    .style('transform', `translateY(${dms.contentHeight}px)`)
  
const yesAxis = content.append('g')
    .attr('id', 'yes-axis')

d3.json('../data/sh.json')
    .then(drawLineChart)


function drawLineChart(dataset) {
    const dateParse = d3.timeParse('%Y-%m-%d')
    const dateGet = d => dateParse(d.date)
    const yesGet = d => d.yes

    const dateScale = d3.scaleTime()
        .domain(d3.extent(dataset, dateGet))
        .range([0, dms.contentWidth])
        .nice()

    const yesScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yesGet))
        .range([dms.contentHeight, 50])
        .nice()

    yesLine.selectAll('circle')
        .data(dataset.filter(d => yesGet(d)))
        .join('circle')
        .attr('cx', d => dateScale(dateGet(d)))
        .attr('cy', d => yesScale(yesGet(d)))
        .attr('r', 4)


    const lineGen = d3.line()
        .x(d => dateScale(dateGet(d)))
        .y(d => yesScale(yesGet(d)))
        // .curve(d3.curveBasis)

    yesLine.append('path')
        .attr('d', lineGen(dataset))

    dateAxisGen = d3.axisBottom()
        .scale(dateScale)
        .ticks(5, d3.timeFormat('%m-%d'))
    
    dateAxis.call(dateAxisGen)

    dateAxis.append('text')
        .attr('id', 'date-title')
        .attr('x', dms.contentWidth + 20)
        .attr('y', 0)
        .text('date')


    yesAxisGen = d3.axisLeft()
        .scale(yesScale)
        .ticks(4)

    yesAxis.call(yesAxisGen)

    yesAxis.append('text')
        .attr('id', 'yes-title')
        .attr('x', 0)
        .attr('y', 30)
        .text('cases')

}