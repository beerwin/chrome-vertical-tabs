const drawDropPlaceholder = (parent, referenceElement) => {
    const placeholder = document.createElement('div');
    placeholder.classList.add('drag-drop-placeholder');
    parent.insertBefore(placeholder, referenceElement);
    return placeholder;
}

const removePlaceholder = () => {
    const placeholder = document.querySelector('.drag-drop-placeholder');
    if (!placeholder) return;
    placeholder.remove();
}

const addDraggable = (selector) => {
    document.querySelectorAll(selector).forEach((element) => {
        element.setAttribute('draggable', true);
        element.addEventListener('dragstart', (e) => {
            removePlaceholder();
            e.dataTransfer.setData('text/plain', JSON.stringify(e.target.dataset));
            e.dataTransfer.dropEffect = 'copy';
            e.target.classList.add('dragging');
        });
        element.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            removePlaceholder();
        });
    })
} 

const addDropTarget = (selector, callback) => {
    document.querySelectorAll(selector).forEach((element) => {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            const referenceElement = e.target.closest(selector);
            if (!referenceElement) return;
            const parent = referenceElement.parentNode;
            removePlaceholder();
            drawDropPlaceholder(parent, referenceElement);
        });
        element.addEventListener('dragleave', (e) => {
            removePlaceholder();
        });
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const referenceElement = e.target.closest(selector);
            callback(referenceElement, data);
            removePlaceholder();
        });
    });
}

export { addDraggable, addDropTarget };