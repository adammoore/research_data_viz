// visualization.js
// D3.js script for rendering the research data lifecycle

document.addEventListener('DOMContentLoaded', function() {
    // Set up SVG and dimensions
    const width = 800;
    const height = 600;
    const svg = d3.select('#visualization')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    // Example data (to be replaced with actual data loading)
    const data = [
        { stage: 'Conceptualise', tools: ['Miro', 'MindMeister', 'XMind'] },
        { stage: 'Planning', tools: ['Lucidchart', 'Draw.io'] },
        // Additional stages...
    ];

    // Visualization logic (to be expanded)
    svg.selectAll('circle')
       .data(data)
       .enter()
       .append('circle')
       .attr('cx', (d, i) => (i + 1) * (width / (data.length + 1)))
       .attr('cy', height / 2)
       .attr('r', 40)
       .attr('fill', 'steelblue')
       .attr('stroke', 'black')
       .attr('stroke-width', 2);

    svg.selectAll('text')
       .data(data)
       .enter()
       .append('text')
       .attr('x', (d, i) => (i + 1) * (width / (data.length + 1)))
       .attr('y', height / 2 - 50)
       .attr('text-anchor', 'middle')
       .text(d => d.stage)
       .attr('fill', 'black')
       .style('font-size', '14px');
});
