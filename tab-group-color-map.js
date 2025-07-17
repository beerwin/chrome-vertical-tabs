export default class TabGroupColorMapper {
    constructor() {
        this.colorMap = new Map();
        this.colorMap.set('red', '#dd9988');
        this.colorMap.set('green', '#88dd99');
        this.colorMap.set('blue', '#8899dd');
        this.colorMap.set('yellow', '#dddd99');
        this.colorMap.set('purple', '#dd88dd');
        this.colorMap.set('orange', '#ddb988');
        this.colorMap.set('pink', '#dd8098');
        this.colorMap.set('cyan', '#88dddd');
        this.colorMap.set('gray', '#dddddd');
        this.colorMap.set('grey', '#dddddd');
    }

    map(color, opacity = "FF") {
        if (this.colorMap.has(color)) {
            return this.colorMap.get(color) + opacity;
        } else {
            console.warn(`Color ${color} not found in color map.`);
            return this.colorMap.get('gray') + opacity; // Default to gray if color not found
        }
    }
}