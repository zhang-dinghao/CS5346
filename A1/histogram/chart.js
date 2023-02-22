const dms = {
    width: 900,
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


const barArea = content.append('g')
    .attr('id', 'bar-area')
  
const yesAxis = content.append('g')
    .attr('id', 'yes-axis')
    .style('transform', `translateY(${dms.contentHeight+10}px)`)

const noAxis = content.append('g')
    .attr('class', 'axis')
  
content.append('text')
    .attr('id', 'count-title')
    .attr('x', -25)
    .attr('y', dms.contentHeight / 2)
    .text('days')


d3.json('../data/sh.json')
    .then(drawHistogram)


function drawHistogram(dataset) {
    const yesGet = d => d.yes
    const countGet = d => d.length
    
    
    const yesScale = d3.scaleLinear()
        .domain(d3.extent(dataset, yesGet))
        .range([0, dms.contentWidth])
        .nice()
    
    const histGen = d3.histogram()
        .value(yesGet)
        .domain(yesScale.domain())
        .thresholds(10)
    
    const hist = histGen(dataset)
    
    const countScale = d3.scaleLinear()
        .domain([0, d3.max(hist, countGet)])
        .range([dms.contentHeight, 0])
    
    const colorScale = d3.scaleLinear()
        .domain(d3.extent(hist, countGet))
        .range(['lightblue', 'darkblue'])
        .nice()
    
    
    const barPadding = 4
    
    barArea.selectAll('rect')
        .data(hist)
        .join('rect')
        .attr('x', d => yesScale(d.x0) + barPadding / 2)
        .attr('y', d => countScale(countGet(d)))
        .attr('width', d => yesScale(d.x1) - yesScale(d.x0) - barPadding)
        .attr('height', d => dms.contentHeight - countScale(countGet(d)))
        .style('fill',d=>colorScale(countGet(d)))
    
    barArea.selectAll('text')
        .data(hist.filter(countGet))
        .join('text')
        .attr('x', d => (yesScale(d.x0) + yesScale(d.x1)) / 2)
        .attr('y', d => countScale(countGet(d)) - 15)
        .text(d=>countGet(d))
        .text(countGet)
    
    
    
    const yesAxisGen = d3.axisBottom()
        .scale(yesScale)
        .ticks(5)
    
    yesAxis.call(yesAxisGen)
    

    yesAxis.append('text')
    .attr('id', 'yes-title')
    .attr('x', dms.contentWidth / 2)
    .attr('y', 35)
    .text('confirmed cases')

}
      