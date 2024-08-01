document.addEventListener('DOMContentLoaded', function() {
    const layout = window.layout;
    const data = window.data;

    const width = 1200;
    const height = 800;
    const svg = d3.select('#visualization')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 300;
    const angleIncrement = (2 * Math.PI) / layout.stages.length;

    layout.stages.forEach((stage, index) => {
        stage.x = centerX + radius * Math.cos(index * angleIncrement);
        stage.y = centerY + radius * Math.sin(index * angleIncrement);
    });

    // Render stages
    layout.stages.forEach(stage => {
        const stageGroup = svg.append('g')
            .attr('class', 'stage-group')
            .attr('transform', `translate(${stage.x},${stage.y})`);

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

        stageGroup.on('mouseover', function() {
            d3.select(this).select('rect').attr('fill', 'lightblue');
            showTooltip(stage.name);
        }).on('mouseout', function() {
            d3.select(this).select('rect').attr('fill', 'lightgreen');
            hideTooltip();
        });

        stageGroup.on('click', function() {
            const stageData = data[stage.name];
            toggleTools(stageData, stageGroup);
        });
    });

    // Render connections between stages
    layout.stages.forEach(stage => {
        stage.connections.forEach(connection => {
            const toStage = layout.stages.find(s => s.name === connection.to);

            if (toStage) {
                svg.append('line')
                   .attr('x1', stage.x + 50)
                   .attr('y1', stage.y + 25)
                   .attr('x2', toStage.x + 50)
                   .attr('y2', toStage.y + 25)
                   .attr('stroke', 'black')
                   .attr('stroke-width', 2)
                   .attr('marker-end', 'url(#arrow)')
                   .attr('stroke-dasharray', connection.type === 'dashed' ? '4,4' : '0');
            }
        });
    });

    // Add arrow markers for connections
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

    // Render substages and exemplars dynamically from data.json
    Object.keys(data).forEach(stageName => {
        const stageData = data[stageName];
        const parentStage = layout.stages.find(s => s.name === stageName);
        if (parentStage) {
            stageData.tool_category_type.forEach((category, index) => {
                const substageX = parentStage.x + 150;
                const substageY = parentStage.y + (index * 70) - 35;

                const substageGroup = svg.append('g')
                    .attr('class', 'substage-group')
                    .attr('transform', `translate(${substageX},${substageY})`);

                substageGroup.append('rect')
                    .attr('width', 200)
                    .attr('height', 50)
                    .attr('fill', 'lightgray')
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2);

                substageGroup.append('text')
                    .attr('x', 100)
                    .attr('y', 25)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .text(category.category)
                    .attr('font-size', '14px')
                    .attr('fill', 'black');

                // Render connections from the parent stage to the substage
                svg.append('line')
                    .attr('x1', parentStage.x + 100)
                    .attr('y1', parentStage.y + 25)
                    .attr('x2', substageX)
                    .attr('y2', substageY + 25)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2)
                    .attr('marker-end', 'url(#arrow)');

                // Render exemplars (if any)
                category.examples.forEach((example, i) => {
                    const exampleX = substageX + 220;
                    const exampleY = substageY + (i * 60);

                    const exampleGroup = svg.append('g')
                        .attr('class', 'example-group')
                        .attr('transform', `translate(${exampleX},${exampleY})`);

                    exampleGroup.append('rect')
                        .attr('width', 150)
                        .attr('height', 50)
                        .attr('fill', 'lightblue')
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2);

                    exampleGroup.append('text')
                        .attr('x', 75)
                        .attr('y', 25)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .text(example)
                        .attr('font-size', '12px')
                        .attr('fill', 'black');

                    // Render connections from substage to exemplar
                    svg.append('line')
                        .attr('x1', substageX + 200)
                        .attr('y1', substageY + 25)
                        .attr('x2', exampleX)
                        .attr('y2', exampleY + 25)
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2)
                        .attr('marker-end', 'url(#arrow)');
                });
            });
        }
    });

    // Reset view button
    d3.select('#reset-view').on('click', function() {
        resetView();
    });

    // Expand all substages
    d3.select('#expand-all').on('click', function() {
        layout.stages.forEach(stage => {
            const stageGroup = svg.selectAll('.stage-group')
                                  .filter(function(d) {
                                      return d3.select(this).select('text').text() === stage.name;
                                  });
            const stageData = data[stage.name];
            toggleTools(stageData, stageGroup);
        });
    });

    // Switch to linear view
    d3.select('#view-mode').on('change', function() {
        const viewMode = d3.select(this).property('value');
        if (viewMode === 'linear') {
            switchToLinearView();
        } else {
            resetView();
        }
    });

    function toggleTools(stageData, stageGroup) {
        // Toggles tools visibility
        if (!stageData || !stageData.tool_category_type) {
            console.error('No tool category data found for this stage.');
            return;
        }

        const toolGroup = stageGroup.selectAll('.tool-group').data(stageData.tool_category_type);

        const toolEnter = toolGroup.enter().append('g')
            .attr('class', 'tool-group')
            .attr('transform', function(d, i) {
                return `translate(120, ${i * 60})`;
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

        toolEnter.on('mouseover', function (d) {
            d3.select(this).select('rect').attr('fill', 'lightblue');
            showTooltip(d.description);
        }).on('mouseout', function () {
            d3.select(this).select('rect').attr('fill', 'lightgray');
            hideTooltip();
        });

        toolGroup.exit().remove();
    }

    function showTooltip(description) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', '#fff')
            .style('border', '1px solid #ccc')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .text(description);

        d3.select('body').on('mousemove', function(event) {
            tooltip.style('left', (event.pageX + 10) + 'px')
                   .style('top', (event.pageY - 10) + 'px')
                   .style('opacity', 1);
        });
    }

    function hideTooltip() {
        d3.select('.tooltip').remove();
    }

    function resetView() {
        svg.selectAll('*').remove();
        // Re-render the circular view
        layout.stages.forEach(stage => {
            const stageGroup = svg.append('g')
                .attr('class', 'stage-group')
                .attr('transform', `translate(${stage.x},${stage.y})`);

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

            stageGroup.on('mouseover', function() {
                d3.select(this).select('rect').attr('fill', 'lightblue');
                showTooltip(stage.name);
            }).on('mouseout', function() {
                d3.select(this).select('rect').attr('fill', 'lightgreen');
                hideTooltip();
            });

            stageGroup.on('click', function() {
                const stageData = data[stage.name];
                toggleTools(stageData, stageGroup);
            });
        });

        // Re-render the substages and exemplars
        Object.keys(data).forEach(stageName => {
            const stageData = data[stageName];
            const parentStage = layout.stages.find(s => s.name === stageName);
            if (parentStage) {
                stageData.tool_category_type.forEach((category, index) => {
                    const substageX = parentStage.x + 150;
                    const substageY = parentStage.y + (index * 70) - 35;

                    const substageGroup = svg.append('g')
                        .attr('class', 'substage-group')
                        .attr('transform', `translate(${substageX},${substageY})`);

                    substageGroup.append('rect')
                        .attr('width', 200)
                        .attr('height', 50)
                        .attr('fill', 'lightgray')
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2);

                    substageGroup.append('text')
                        .attr('x', 100)
                        .attr('y', 25)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .text(category.category)
                        .attr('font-size', '14px')
                        .attr('fill', 'black');

                    svg.append('line')
                        .attr('x1', parentStage.x + 100)
                        .attr('y1', parentStage.y + 25)
                        .attr('x2', substageX)
                        .attr('y2', substageY + 25)
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2)
                        .attr('marker-end', 'url(#arrow)');

                    category.examples.forEach((example, i) => {
                        const exampleX = substageX + 220;
                        const exampleY = substageY + (i * 60);

                        const exampleGroup = svg.append('g')
                            .attr('class', 'example-group')
                            .attr('transform', `translate(${exampleX},${exampleY})`);

                        exampleGroup.append('rect')
                            .attr('width', 150)
                            .attr('height', 50)
                            .attr('fill', 'lightblue')
                            .attr('stroke', 'black')
                            .attr('stroke-width', 2);

                        exampleGroup.append('text')
                            .attr('x', 75)
                            .attr('y', 25)
                            .attr('text-anchor', 'middle')
                            .attr('dominant-baseline', 'middle')
                            .text(example)
                            .attr('font-size', '12px')
                            .attr('fill', 'black');

                        svg.append('line')
                            .attr('x1', substageX + 200)
                            .attr('y1', substageY + 25)
                            .attr('x2', exampleX)
                            .attr('y2', exampleY + 25)
                            .attr('stroke', 'black')
                            .attr('stroke-width', 2)
                            .attr('marker-end', 'url(#arrow)');
                    });
                });
            }
        });
    }

    function switchToLinearView() {
        svg.selectAll('*').remove();
        let yPosition = 100;
        layout.stages.forEach((stage, index) => {
            stage.x = 100;
            stage.y = yPosition;
            yPosition += 100;

            // Render stages in linear view
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
                .attr('font-size', '14px')
                .attr('fill', 'black');

            // Render connections between stages
            if (index > 0) {
                const previousStage = layout.stages[index - 1];
                svg.append('line')
                    .attr('x1', previousStage.x + 200)
                    .attr('y1', previousStage.y + 25)
                    .attr('x2', stage.x)
                    .attr('y2', stage.y + 25)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 2)
                    .attr('marker-end', 'url(#arrow)');
            }

            stageGroup.on('mouseover', function() {
                d3.select(this).select('rect').attr('fill', 'lightblue');
                showTooltip(stage.name);
            }).on('mouseout', function() {
                d3.select(this).select('rect').attr('fill', 'lightgreen');
                hideTooltip();
            });

            stageGroup.on('click', function() {
                const stageData = data[stage.name];
                toggleTools(stageData, stageGroup);
            });
        });

        // Render substages and exemplars in linear view
        Object.keys(data).forEach(stageName => {
            const stageData = data[stageName];
            const parentStage = layout.stages.find(s => s.name === stageName);
            if (parentStage) {
                stageData.tool_category_type.forEach((category, index) => {
                    const substageX = parentStage.x + 240;
                    const substageY = parentStage.y + (index * 70) - 35;

                    const substageGroup = svg.append('g')
                        .attr('class', 'substage-group')
                        .attr('transform', `translate(${substageX},${substageY})`);

                    substageGroup.append('rect')
                        .attr('width', 200)
                        .attr('height', 50)
                        .attr('fill', 'lightgray')
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2);

                    substageGroup.append('text')
                        .attr('x', 100)
                        .attr('y', 25)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .text(category.category)
                        .attr('font-size', '14px')
                        .attr('fill', 'black');

                    svg.append('line')
                        .attr('x1', parentStage.x + 200)
                        .attr('y1', parentStage.y + 25)
                        .attr('x2', substageX)
                        .attr('y2', substageY + 25)
                        .attr('stroke', 'black')
                        .attr('stroke-width', 2)
                        .attr('marker-end', 'url(#arrow)');

                    category.examples.forEach((example, i) => {
                        const exampleX = substageX + 240;
                        const exampleY = substageY + (i * 60);

                        const exampleGroup = svg.append('g')
                            .attr('class', 'example-group')
                            .attr('transform', `translate(${exampleX},${exampleY})`);

                        exampleGroup.append('rect')
                            .attr('width', 150)
                            .attr('height', 50)
                            .attr('fill', 'lightblue')
                            .attr('stroke', 'black')
                            .attr('stroke-width', 2);

                        exampleGroup.append('text')
                            .attr('x', 75)
                            .attr('y', 25)
                            .attr('text-anchor', 'middle')
                            .attr('dominant-baseline', 'middle')
                            .text(example)
                            .attr('font-size', '12px')
                            .attr('fill', 'black');

                        svg.append('line')
                            .attr('x1', substageX + 200)
                            .attr('y1', substageY + 25)
                            .attr('x2', exampleX)
                            .attr('y2', exampleY + 25)
                            .attr('stroke', 'black')
                            .attr('stroke-width', 2)
                            .attr('marker-end', 'url(#arrow)');
                    });
                });
            }
        });
    }
});

