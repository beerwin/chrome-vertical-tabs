import TabGroupColorMapper from "./tab-group-color-map.js";
import TabGroupEditor from "./tab-group-editor.js";
import { fromTemplate } from "./templates.js";

const groupTemplate = `
    <div class="group-icon" title="{title}" data-group-id="{id}"></div>
`

const tabGroupListContainer = () => document.querySelector('.group-icons');
const clearContainer = () => {
    tabGroupListContainer().innerHTML = '';
}

const createAddGroupElement = (tabManager) => {
    const addGroupElement = fromTemplate(groupTemplate, {
        title: 'Add Group',
        id: 'add-group'
    });
    addGroupElement.classList.add('add-group');
    addGroupElement.innerHTML = '<div>+</div>';
    addGroupElement.onclick = async () => {
        tabManager.beginUpdate();
        const tab = await tabManager.createTab();
        const newGroup = await tabManager.createGroup("", [tab.id]);
        await tabManager.setCurrentGroupId(newGroup);
        tabManager.endUpdate();
    }
    tabGroupListContainer().appendChild(addGroupElement);
}

export const renderTabGroupIcons = (tabManager) => {
    clearContainer();
    for (let x in tabManager.tabGroups) {
        const tabGroup = tabManager.tabGroups[x];
        const groupElement = fromTemplate(groupTemplate, {
            title: tabGroup.title,
            id: tabGroup.id
        });
        groupElement.style.backgroundColor = (new TabGroupColorMapper).map(tabGroup.color);
        if (tabManager.activeTabGroupId() === tabGroup.id) {
            groupElement.classList.add('active');
        }
        tabGroupListContainer().appendChild(groupElement);
        groupElement.onclick = async function () {
            await tabManager.setCurrentGroupId(tabGroup.id);
        };
        if (tabGroup.id > 0) {
            groupElement.ondblclick = async function () {
                new TabGroupEditor(tabManager, tabGroup);
            }
        }
    }

    createAddGroupElement(tabManager);
}
