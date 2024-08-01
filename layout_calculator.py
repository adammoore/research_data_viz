import math

def calculate_positions(layout_data, width=1200, height=800, radius=300):
    center_x = width // 2
    center_y = height // 2
    angle_increment = (2 * math.pi) / len(layout_data['stages'])

    for index, stage in enumerate(layout_data['stages']):
        stage['x'] = center_x + radius * math.cos(index * angle_increment)
        stage['y'] = center_y + radius * math.sin(index * angle_increment)

        if 'tool_category_type' in stage:
            for subindex, substage in enumerate(stage['tool_category_type']):
                substage['x'] = stage['x'] + 150 * math.cos(subindex * angle_increment)
                substage['y'] = stage['y'] + 150 * math.sin(subindex * angle_increment)

    return layout_data

def linear_positions(layout_data, start_x=100, start_y=100, y_increment=100):
    y_position = start_y

    for stage in layout_data['stages']:
        stage['x'] = start_x
        stage['y'] = y_position
        y_position += y_increment

        if 'tool_category_type' in stage:
            sub_y_position = y_position
            for substage in stage['tool_category_type']:
                substage['x'] = start_x + 240
                substage['y'] = sub_y_position
                sub_y_position += y_increment

    return layout_data

