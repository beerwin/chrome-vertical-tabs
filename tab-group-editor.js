import { mapColor } from "./tab-group-color-map.js";
import { beginUpdate, endUpdate, removeGroup, renameGroup, setGroupColor } from "./tab-manager.js";
let dialogElement = null;

const groupContextDialog = () => {
    if (!dialogElement) {
        dialogElement = document.querySelector('#groupContextDialog');
    }

    return dialogElement;
}

export const tabGroupEditor = (tabGroup) => {
    showModal(tabGroup);
    setTitle(tabGroup);
    initUpdateAction(tabGroup);
    initDeleteAction(tabGroup);
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

const initDeleteAction = (tabGroup) => {
    const deleteButton = document.querySelector('#deleteGroup');
    deleteButton.onclick = async function () {
        await removeGroup(tabGroup.id);
        closeDialog();
    }
}

const initUpdateAction = (tabGroup) => {
    const updateButton = document.querySelector('#saveGroup');
    updateButton.onclick = async function () {
        const newTitle = document.querySelector('#groupName').value;
        const newColor = document.querySelector('#groupColor').value;
        beginUpdate();
        if (newTitle) {
            await renameGroup(tabGroup.id, newTitle);
        }
        await setGroupColor(tabGroup.id, newColor);
        endUpdate();
        closeDialog();
    }
}

const initCancelAction = () => {
    const cancelButton = document.querySelector('#cancelGroup');
    cancelButton.onclick = async function () {
        closeDialog();
    }
}