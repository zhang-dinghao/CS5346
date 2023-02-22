const dms = {
    width: 600,
    height: 600,
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


const dotArea = content.append('g')
    .attr('id', 'dot-area')

const yesAxis = content.append('g')
    .attr('class', 'axis')
    .style('transform', `translateY(${dms.contentHeight}px)`)
  
const noAxis = content.append('g')
    .attr('class', 'axis')

content.append('line')
    .attr('id','line')
    .attr('x1',0)
    .attr('y1',dms.contentHeight)
    .attr('x2',dms.contentWidth)
    .attr('y2',0)


d3.json('../data/sh.json')
    .then(drawDotChart)



function drawDotChart(dataset) {
    const yesGet = d => d.yes
    const noGet = d => d.no

    
    const yesScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yesGet))
        .range([0, dms.contentWidth])
        .nice()
    
    const noScale = d3.scaleLinear()
        .domain(d3.extent(dataset, noGet))
        .range([dms.contentHeight, 0])
        .nice()
    
    
    dotArea.selectAll('circle')
        .data(dataset)
        .join('circle')
        .attr('cx', d => yesScale(yesGet(d)))
        .attr('cy', d => noScale(noGet(d)))
        .attr('r', 5)
    
    
    
    const yesAxisGen = d3.axisBottom()
        .scale(yesScale)
        .ticks(5)
    
    yesAxis.call(yesAxisGen)
    
    yesAxis.append('text')
        .attr('class', 'title')
        .attr('x', dms.contentWidth-10)
        .attr('y', -20)
        .text('confirmed cases')
    
    const noAxisGen = d3.axisLeft()
        .scale(noScale)
        .ticks(5)
    
    noAxis.call(noAxisGen)
    
    noAxis.append('text')
        .attr('class', 'title')
        .attr('x', 20)
        .attr('y', -20)
        .text('asymptomatic carriers')
    }
      