import { mapColor } from "./tab-group-color-map.js";

export default class TabGroupEditor {
    constructor(TabManager, tabGroup) {
        this.tabManager = TabManager;
        this.tabGroup = tabGroup;
        this.showModal();
        this.setTitle();
        this.initUpdateAction();
        this.initDeleteAction();
        this.initCancelAction();
    }

    buildColors() {
        document.querySelectorAll('.color').forEach(e => {
            e.classList.remove('selected');
            e.style.backgroundColor = mapColor(e.dataset.color);
            if (e.dataset.color === this.tabGroup.color) {
                e.classList.add('selected');
            }
            e.onclick = this.selectColor.bind(this);
        })
    }

    selectColor(event) {
        const selectedColorEl = document.querySelector('.color.selected');
        if (selectedColorEl) {
            selectedColorEl.classList.remove('selected');
        }
        document.querySelector('#groupColor').value = event.target.dataset.color;
        event.currentTarget.classList.add('selected');
    }

    showModal() {
        document.querySelector('#groupColor').value = this.tabGroup.color;
        this.buildColors();
        document.querySelector('#groupContextDialog').showModal();
    }

    closeDialog() {
        document.querySelector('#groupContextDialog').close();
    }

    setTitle() {
        document.querySelector("#groupName").value = this.tabGroup.title;
    }

    initDeleteAction() {
        const deleteButton = document.querySelector('#deleteGroup');
        deleteButton.onclick = async function () {
            await this.tabManager.removeGroup(this.tabGroup.id);
            this.closeDialog();
        }.bind(this);
    }

    initUpdateAction() {
        const updateButton = document.querySelector('#saveGroup');
        updateButton.onclick = async function () {
            const newTitle = document.querySelector('#groupName').value;
            const newColor = document.querySelector('#groupColor').value;
            this.tabManager.beginUpdate();
            if (newTitle) {
                await this.tabManager.renameGroup(this.tabGroup.id, newTitle);
            }
            await this.tabManager.setGroupColor(this.tabGroup.id,newColor);
            this.tabManager.endUpdate();
            this.closeDialog();
        }.bind(this);
    }

    initCancelAction() {
        const cancelButton = document.querySelector('#cancelGroup');
        cancelButton.onclick = async function () {
            this.closeDialog();
        }.bind(this);
    }
}