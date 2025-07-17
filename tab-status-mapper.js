export default class TabStatusMapper {
    constructor() {
        this.mapping = new Map();
        this.mapping.set('loading', 'loading');
        this.mapping.set('complete', 'complete');
        this.mapping.set('interrupted', 'interrupted');
        this.mapping.set('error', 'error');
        this.mapping.set('unloaded', 'unloaded');
    }

    map(status) {
        return this.mapping.get(status) || 'unknown';
    }
}