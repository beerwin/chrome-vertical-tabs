import { mapColor } from "./tab-group-color-map.js";
let dialogElement = null;

const groupContextDialog = () => {
    if (!dialogElement) {
        dialogElement = document.querySelector('#groupContextDialog');
    }

    return dialogElement;
}

export const tabGroupEditor = (tabManager, tabGroup) => {
    showModal(tabGroup);
    setTitle(tabGroup);
    initUpdateAction(tabManager, tabGroup);
    initDeleteAction(tabManager, tabGroup);
    initCancelAction();
}

const buildColors = (tabGroup) => {
    document.querySelectorAll('.color').forEach(e => {
        e.classList.remove('selected');
        e.style.backgroundColor = mapColor(e.dataset.color);
        if (e.dataset.color === tabGroup.color) {
            e.classList.add('selected');
        }
        e.onclick = selectColor
    })
}

const selectColor = (event) => {
    const selectedColorEl = document.querySelector('.color.selected');
    if (selectedColorEl) {
        selectedColorEl.classList.remove('selected');
    }
    document.querySelector('#groupColor').value = event.target.dataset.color;
    event.currentTarget.classList.add('selected');
}

const showModal = (tabGroup) => {
    document.querySelector('#groupColor').value = tabGroup.color;
    buildColors(tabGroup);
    groupContextDialog().showModal();
}

const closeDialog = () => {
    groupContextDialog().close();
}

const setTitle = (tabGroup) => {
    document.querySelector("#groupName").value = tabGroup.title;
}

const initDeleteAction = (tabManager, tabGroup) => {
    const deleteButton = document.querySelector('#deleteGroup');
    deleteButton.onclick = async function () {
        await tabManager.removeGroup(tabGroup.id);
        closeDialog();
    }
}

const initUpdateAction = (tabManager, tabGroup) => {
    const updateButton = document.querySelector('#saveGroup');
    updateButton.onclick = async function () {
        const newTitle = document.querySelector('#groupName').value;
        const newColor = document.querySelector('#groupColor').value;
        tabManager.beginUpdate();
        if (newTitle) {
            await tabManager.renameGroup(tabGroup.id, newTitle);
        }
        await tabManager.setGroupColor(tabGroup.id, newColor);
        tabManager.endUpdate();
        closeDialog();
    }
}

const initCancelAction = () => {
    const cancelButton = document.querySelector('#cancelGroup');
    cancelButton.onclick = async function () {
        closeDialog();
    }
}