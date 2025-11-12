const colorMap = new Map();
        
colorMap.set('red', '#dd9988');
colorMap.set('green', '#88dd99');
colorMap.set('blue', '#8899dd');
colorMap.set('yellow', '#dddd99');
colorMap.set('purple', '#dd88dd');
colorMap.set('orange', '#ddb988');
colorMap.set('pink', '#dd8098');
colorMap.set('cyan', '#88dddd');
colorMap.set('gray', '#dddddd');
colorMap.set('grey', '#dddddd');

export const mapColor = (color, opacity = "FF") => {
    if (colorMap.has(color)) {
        return colorMap.get(color) + opacity;
    } 

    console.warn(`Color ${color} not found in color map.`);
    return colorMap.get('gray') + opacity; // Default to gray if color not found
}
