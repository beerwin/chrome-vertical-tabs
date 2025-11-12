import { mapColor } from "./src/js/tab-group-color-map.js";
import { tabGroupEditor } from "./tab-group-editor.js";
import { fromTemplate } from "./src/js/templates.js";
import {
    tabGroups,
    activeTabGroupId,
    setCurrentGroupId,
    beginUpdate,
    endUpdate,
    createTab,
    createGroup,
} from './tab-manager.js'

const groupTemplate = `
    <div class="group-icon" title="{title}" data-group-id="{id}"></div>
`

const tabGroupListContainer = () => document.querySelector('.group-icons');
const clearContainer = () => {
    tabGroupListContainer().innerHTML = '';
}

const createAddGroupElement = () => {
    const addGroupElement = fromTemplate(groupTemplate, {
        title: 'Add Group',
        id: 'add-group'
    });
    addGroupElement.classList.add('add-group');
    addGroupElement.innerHTML = '<div>+</div>';
    addGroupElement.onclick = async () => {
        beginUpdate();
        const tab = await createTab();
        const newGroup = await createGroup("", [tab.id]);
        setCurrentGroupId(newGroup);
        endUpdate();
    }
    tabGroupListContainer().appendChild(addGroupElement);
}

export const renderTabGroupIcons = () => {
    clearContainer();
    for (let x in tabGroups) {
        const tabGroup = tabGroups[x];
        const groupElement = fromTemplate(groupTemplate, {
            title: tabGroup.title,
            id: tabGroup.id
        });
        groupElement.style.backgroundColor = mapColor(tabGroup.color);
        if (activeTabGroupId() === tabGroup.id) {
            groupElement.classList.add('active');
        }
        tabGroupListContainer().appendChild(groupElement);
        groupElement.onclick = async function () {
            await setCurrentGroupId(tabGroup.id);
        };
        if (tabGroup.id > 0) {
            groupElement.ondblclick = async function () {
                tabGroupEditor(tabGroup);
            }
        }
    }

    createAddGroupElement();
}
