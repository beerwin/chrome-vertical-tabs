import { addDraggable, addDropTarget } from "./drag-drop.js";
import { renderTabGroupIcons } from "./tab-group-icon-renderer.js";
import { buildTab } from "./tab-builder.js";
import { renderPinnedTabs } from "./pinned-tabs-renderer.js";
import {mapColor} from "./tab-group-color-map.js";
import TabStatusMapper from "./tab-status-mapper.js";

let groupsContainerElement = null;

const groupsContainer = () => {
    console.log(groupsContainerElement);
    if (!groupsContainerElement) {
        groupsContainerElement = document.querySelector('.groups');
    }
    console.log(groupsContainerElement);
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

export const renderTabs = async (tabManager) => {
    clearGroupsContainer();
    renderPinnedTabs(tabManager);
    const currentTabs = tabManager.getTabsByGroupId();
    if (tabManager.getCurrentGroupId() === -1) {
        groupsContainer().style.backgroundColor = 'transparent';
    } else {
        groupsContainer().style.backgroundColor = mapColor(
            tabManager.tabGroupById(tabManager.getCurrentGroupId()).color,
            '22'
        );
    }
    for (let x in currentTabs) {
        const tab = currentTabs[x];
        groupsContainer().appendChild(buildTab(tab, null, tabManager));
    }

    renderTabGroupIcons(tabManager);

    addInteractions(tabManager);

    revealActiveTab();
}

export const updateTab = (tabId, changeInfo) => {
    const tabElement = document.querySelector(`.tab[data-tab-id="${tabId}"]`);
    if (!tabElement) {
        return;
    }

    console.log('updateTab', tabId, changeInfo);

    if (changeInfo.status) {
        console.log(changeInfo.status)
        tabElement.classList.remove('loading', 'complete', 'error', 'unloaded', 'interrupted');
        const mapper = new TabStatusMapper();
        tabElement.classList.add(mapper.map(changeInfo.status));
    }

    if (changeInfo.favIconUrl) {
        const tabIconElement = tabElement.querySelector('.tab-icon');
        if (tabIconElement) {
            console.log(changeInfo.favIconUrl);
            tabIconElement.src = changeInfo.favIconUrl;
        }
    }

    if (changeInfo.title) {
        const tabTitleElement = tabElement.querySelector('.tab-title');
        if (tabTitleElement) {
            console.log(changeInfo.title);
            tabTitleElement.innerHTML = changeInfo.title.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
        }
    }
}

const addInteractions = (tabManager) => {
    addDraggable('.groups .tab');
    addDropTarget('.groups .tab', async (target, data) => {
        const targetData = target.dataset;
        await tabManager.moveTab(parseInt(data.tabId), parseInt(targetData.tabIndex));
    });

    addDropTarget('.group-icons .group-icon:not(.add-group)', async (target, data) => {
        const targetData = target.dataset;
        await tabManager.moveTabToGroup(parseInt(data.tabId), parseInt(targetData.groupId));
    });

    addDropTarget('.group-icons .add-group', async (target, data) => {
        tabManager.beginUpdate();
        const newGroup = await tabManager.createGroup("", [parseInt(data.tabId)]);
        await tabManager.setCurrentGroupId(newGroup);
        tabManager.endUpdate();
    });
}
