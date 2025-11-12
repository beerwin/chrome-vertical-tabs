const mapping = new Map();
mapping.set('loading', 'loading');
mapping.set('complete', 'complete');
mapping.set('interrupted', 'interrupted');
mapping.set('error', 'error');
mapping.set('unloaded', 'unloaded');

export const mapTabStatus = (status) => {
    return mapping.get(status) || 'unknown';
}