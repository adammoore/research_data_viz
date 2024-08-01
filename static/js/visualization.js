// visualization.js
// D3.js script for rendering the research data lifecycle

document.addEventListener('DOMContentLoaded', function() {
    // Load the layout and data from Flask context
    const layout = {{ layout|tojson }};
    const data = {{ data|tojson }};

    const width = 1400;  // Increase width for better spacing
    const height = 500;  // Adjust height accordingly
    const svg = d3.select('#visualization')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    // Render the stages
    layout.stages.forEach((stage) => {
        svg.append('rect')
           .attr('x', stage.x - 100)
           .attr('y', stage.y - 25)
           .attr('width', 200)
           .attr('height', 50)
           .attr('fill', 'lightgreen')
           .attr('stroke', 'black')
           .attr('stroke-width', 2);

        svg.append('text')
           .attr('x', stage.x)
           .attr('y', stage.y)
           .attr('text-anchor', 'middle')
           .attr('dominant-baseline', 'middle')
           .text(stage.name)
           .attr('font-size', '16px')
           .attr('fill', 'black');
    });

    // Render connections between stages
    layout.connections.forEach((connection) => {
        const fromStage = layout.stages.find(s => s.name === connection.from);
        const toStage = layout.stages.find(s => s.name === connection.to);

        if (fromStage && toStage) {
            svg.append('line')
               .attr('x1', fromStage.x)
               .attr('y1', fromStage.y + 25)
               .attr('x2', toStage.x)
               .attr('y2', toStage.y - 25)
               .attr('stroke', 'black')
               .attr('stroke-width', 2)
               .attr('marker-end', 'url(#arrow)');
        }
    });

    // Add marker for arrowheads
    svg.append('defs').append('marker')
       .attr('id', 'arrow')
       .attr('viewBox', '0 0 10 10')
       .attr('refX', 5)
       .attr('refY', 5)
       .attr('markerWidth', 6)
       .attr('markerHeight', 6)
       .attr('orient', 'auto')
       .append('path')
       .attr('d', 'M 0 0 L 10 5 L 0 10 z')
       .attr('fill', 'black');
});

