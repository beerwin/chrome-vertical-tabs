import { addDraggable, addDropTarget } from "./drag-drop.js";
import { renderTabGroupIcons } from "./tab-group-icon-renderer.js";
import { buildTab } from "./tab-builder.js";
import { renderPinnedTabs } from "./pinned-tabs-renderer.js";
import { mapColor } from "./tab-group-color-map.js";
import { 
    getTabsByGroupId,
    getCurrentGroupId,
    tabGroupById,
    moveTab,
    moveTabToGroup,
    createGroup,
    beginUpdate,
    endUpdate,
    setCurrentGroupId,
} from "./tab-manager.js";
import TabStatusMapper from "./tab-status-mapper.js";

let groupsContainerElement = null;

const groupsContainer = () => {
    if (!groupsContainerElement) {
        groupsContainerElement = document.querySelector('.groups');
    }
    return groupsContainerElement;
}

const clearGroupsContainer = () => {
    groupsContainer().innerHTML = '';
}

const revealActiveTab = () => {
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
        activeTab.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
        });
    }
}

export const renderTabs = async () => {
    clearGroupsContainer();
    renderPinnedTabs();
    const currentTabs = getTabsByGroupId();
    if (getCurrentGroupId() === -1) {
        groupsContainer().style.backgroundColor = 'transparent';
    } else {
        groupsContainer().style.backgroundColor = mapColor(
            tabGroupById(getCurrentGroupId()).color,
            '22'
        );
    }
    for (let x in currentTabs) {
        const tab = currentTabs[x];
        groupsContainer().appendChild(buildTab(tab, null));
    }

    renderTabGroupIcons();

    addInteractions();

    revealActiveTab();
}

export const updateTab = (tabId, changeInfo) => {
    const tabElement = document.querySelector(`.tab[data-tab-id="${tabId}"]`);
    if (!tabElement) {
        return;
    }

    if (changeInfo.status) {
        tabElement.classList.remove('loading', 'complete', 'error', 'unloaded', 'interrupted');
        const mapper = new TabStatusMapper();
        tabElement.classList.add(mapper.map(changeInfo.status));
    }

    if (changeInfo.favIconUrl) {
        const tabIconElement = tabElement.querySelector('.tab-icon');
        if (tabIconElement) {
            tabIconElement.src = changeInfo.favIconUrl;
        }
    }

    if (changeInfo.title) {
        const tabTitleElement = tabElement.querySelector('.tab-title');
        if (tabTitleElement) {
            tabTitleElement.innerHTML = changeInfo.title.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
        }
    }
}

const addInteractions = () => {
    addDraggable('.groups .tab');
    addDropTarget('.groups .tab', async (target, data) => {
        const targetData = target.dataset;
        await moveTab(parseInt(data.tabId), parseInt(targetData.tabIndex));
    });

    addDropTarget('.group-icons .group-icon:not(.add-group)', async (target, data) => {
        const targetData = target.dataset;
        await moveTabToGroup(parseInt(data.tabId), parseInt(targetData.groupId));
    });

    addDropTarget('.group-icons .add-group', async (target, data) => {
        beginUpdate();
        const newGroup = await createGroup("", [parseInt(data.tabId)]);
        setCurrentGroupId(newGroup);
        endUpdate();
    });
}
