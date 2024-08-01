document.addEventListener('DOMContentLoaded', function() {
    const svg = d3.select('#visualization')
                  .append('svg')
                  .attr('width', 1200)
                  .attr('height', 800);

    function renderView(viewMode) {
        d3.json(`/api/layout/${viewMode}`).then(layoutData => {
            svg.selectAll('*').remove();
            drawStages(layoutData.stages);
            drawConnections(layoutData.connections, layoutData.stages, viewMode);
        });
    }

    function drawStages(stages) {
        stages.forEach(stage => {
            const stageGroup = svg.append('g')
                .attr('class', 'stage-group')
                .attr('transform', `translate(${stage.x},${stage.y})`)
                .on('click', function() {
                    toggleStage(stage.name);
                });

            stageGroup.append('rect')
                .attr('width', 100)
                .attr('height', 50)
                .attr('fill', 'lightgreen')
                .attr('stroke', 'black')
                .attr('stroke-width', 2);

            stageGroup.append('text')
                .attr('x', 50)
                .attr('y', 25)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .text(stage.name)
                .attr('font-size', '14px')
                .attr('fill', 'black');
        });
    }

    function drawConnections(connections, stages, viewMode) {
        connections.forEach(connection => {
            const fromStage = stages.find(stage => stage.name === connection.from);
            const toStage = stages.find(stage => stage.name === connection.to);

            if (fromStage && toStage) {
                svg.append('line')
                    .attr('x1', fromStage.x + 50)
                    .attr('y1', fromStage.y + 25)
                    .attr('x2', toStage.x + (viewMode === 'circular' ? 50 : 0))
                    .attr('y2', toStage.y + 25)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2)
                    .attr('marker-end', 'url(#arrow)')
                    .attr('stroke-dasharray', connection.type === 'dashed' ? '4,4' : '0');
            }
        });

        svg.append('defs').append('marker')
           .attr('id', 'arrow')
           .attr('viewBox', '0 0 10 10')
           .attr('refX', 10)
           .attr('refY', 5)
           .attr('markerWidth', 6)
           .attr('markerHeight', 6)
           .attr('orient', 'auto')
           .append('path')
           .attr('d', 'M 0 0 L 10 5 L 0 10 z')
           .attr('fill', 'black');
    }

    function toggleStage(stageName) {
        // Toggle visibility of substages and exemplars
    }

    document.getElementById('view-mode').addEventListener('change', function() {
        const viewMode = this.value;
        renderView(viewMode);
    });

    // Initial rendering based on the selected view mode
    const initialViewMode = document.getElementById('view-mode').value;
    renderView(initialViewMode);
});

