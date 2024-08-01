// visualization.js
// D3.js script for rendering the research data lifecycle with interactivity

document.addEventListener('DOMContentLoaded', function() {
    const layout = window.layout;
    const data = window.data;

    const width = 1400;
    const height = 800;
    const svg = d3.select('#visualization')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    // Render stages
    layout.stages.forEach((stage) => {
        const stageGroup = svg.append('g')
            .attr('class', 'stage-group')
            .attr('transform', `translate(${stage.x},${stage.y})`);

        stageGroup.append('rect')
            .attr('width', 200)
            .attr('height', 50)
            .attr('fill', 'lightgreen')
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        stageGroup.append('text')
            .attr('x', 100)
            .attr('y', 25)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(stage.name)
            .attr('font-size', '16px')
            .attr('fill', 'black');

        // Hover interaction for descriptions
        stageGroup.on('mouseover', function () {
            d3.select(this).select('rect').attr('fill', 'lightblue');
            // Show description tooltip
            showTooltip(stage.name);
        }).on('mouseout', function () {
            d3.select(this).select('rect').attr('fill', 'lightgreen');
            hideTooltip();
        });

        // Click interaction to show/hide tools
        stageGroup.on('click', function() {
            const stageData = data[stage.name];
            toggleTools(stageData, stageGroup);
        });
    });

    // Render connections between stages
    layout.connections.forEach((connection) => {
        const fromStage = layout.stages.find(s => s.name === connection.from);
        const toStage = layout.stages.find(s => s.name === connection.to);

        if (fromStage && toStage) {
            svg.append('line')
               .attr('x1', fromStage.x + 100)
               .attr('y1', fromStage.y + 25)
               .attr('x2', toStage.x + 100)
               .attr('y2', toStage.y + 25)
               .attr('stroke', 'black')
               .attr('stroke-width', 2)
               .attr('stroke-dasharray', connection.type === 'dashed' ? '4' : '0');
        }
    });

    // Functions to show/hide tool details on click
    function toggleTools(stageData, stageGroup) {
        const toolGroup = stageGroup.selectAll('.tool-group').data(stageData.tool_category_type);

        // Enter new tool categories
        const toolEnter = toolGroup.enter().append('g')
            .attr('class', 'tool-group')
            .attr('transform', function(d, i) {
                return `translate(220, ${i * 60})`;
            });

        toolEnter.append('rect')
            .attr('width', 300)
            .attr('height', 50)
            .attr('fill', 'lightgray')
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        toolEnter.append('text')
            .attr('x', 150)
            .attr('y', 25)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text(d => d.category)
            .attr('font-size', '14px')
            .attr('fill', 'black');

        // Hover interaction for tool descriptions
        toolEnter.on('mouseover', function (d) {
            d3.select(this).select('rect').attr('fill', 'lightblue');
            showTooltip(d.description);
        }).on('mouseout', function () {
            d3.select(this).select('rect').attr('fill', 'lightgray');
            hideTooltip();
        });

        // Handle existing tool categories
        toolGroup.transition().duration(500)
            .attr('transform', function(d, i) {
                return `translate(220, ${i * 60})`;
            });

        // Exit old tool categories
        toolGroup.exit().remove();
    }

    // Tooltip functions for hover descriptions
    function showTooltip(description) {
        // Implement tooltip display logic
    }

    function hideTooltip() {
        // Implement tooltip hide logic
    }
});
