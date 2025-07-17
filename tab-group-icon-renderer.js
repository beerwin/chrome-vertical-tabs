import TabGroupEditor from "./tab-group-editor.js";
import TabGroupColorMapper from "./tab-group-color-map.js";

export default class TabGroupIconRenderer {
    constructor(TabManager) {
        this.tabManager = TabManager;
        this.tabGgroupListContainer = document.querySelector('.group-icons');
        this.colorMapper = new TabGroupColorMapper();
    }

    render() {
        this.clearContainer();
        for (let x in this.tabManager.tabGroups) {
            const tabGroup = this.tabManager.tabGroups[x];
            const groupElement = document.createElement('div');
            groupElement.classList.add('group-icon');
            groupElement.setAttribute('title', tabGroup.title);
            groupElement.setAttribute('data-group-id', tabGroup.id);
            groupElement.style.backgroundColor = this.colorMapper.map(tabGroup.color);
            if (this.tabManager.activeTabGroupId() === tabGroup.id) {
                groupElement.classList.add('active');
            }
            this.tabGgroupListContainer.appendChild(groupElement);
            groupElement.onclick = async function () {
                await this.tabManager.setCurrentGroupId(tabGroup.id);
            }.bind(this);
            if (tabGroup.id > 0) {
                groupElement.ondblclick = async function () {
                    new TabGroupEditor(this.tabManager, tabGroup);
                }.bind(this);
            }
        }

        const addGroupElement = document.createElement('div');
        addGroupElement.classList.add('group-icon');
        addGroupElement.classList.add('add-group');
        addGroupElement.setAttribute('title', 'Add Group');
        addGroupElement.innerHTML = '<div>+</div>';
        addGroupElement.onclick = this.addTabGroupElement.bind(this);
        this.tabGgroupListContainer.appendChild(addGroupElement);
    }

    clearContainer() {
        this.tabGgroupListContainer.innerHTML = '';
    }

    async addTabGroupElement() {
        this.tabManager.beginUpdate();
        const tab = await this.tabManager.createTab();
        const newGroup = await this.tabManager.createGroup("", [tab.id]);
        await this.tabManager.setCurrentGroupId(newGroup);
        this.tabManager.endUpdate();
    }
}