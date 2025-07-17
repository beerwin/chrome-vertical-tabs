import { addDraggable, addDropTarget } from "./drag-drop.js";
import TabGroupIconRenderer from "./tab-group-icon-renderer.js";
import PinnedTabsRenderer from "./pinned-tabs-renderer.js";
import TabBuilder from "./tab-builder.js";
import TabGroupColorMapper from "./tab-group-color-map.js";
import TabStatusMapper from "./tab-status-mapper.js";

export default class TabRenderer {
    constructor(tabManager) {
        this.tabManager = tabManager;
        this.tabBuilder = new TabBuilder(this.tabManager);
        this.groupsContainer = document.querySelector('.groups');
        this.tabGroupIconRenderer = new TabGroupIconRenderer(this.tabManager);
        this.pinnedTabsRenderer = new PinnedTabsRenderer(this.tabManager, this.tabBuilder);
        this.colorMapper = new TabGroupColorMapper();
    }

    clearGroupsContainer() {
        this.groupsContainer.innerHTML = '';
    }

    async render() {
        this.clearGroupsContainer();
        this.pinnedTabsRenderer.render();
        const currentTabs = this.tabManager.getTabsByGroupId();
        if (this.tabManager.getCurrentGroupId() === -1) {
            this.groupsContainer.style.backgroundColor = 'transparent';
        } else {
            this.groupsContainer.style.backgroundColor = this.colorMapper.map(
                this.tabManager.tabGroupById(this.tabManager.getCurrentGroupId()).color,
                '22'
            );
        }
        for (let x in currentTabs) {
            const tab = currentTabs[x];
            this.groupsContainer.appendChild(this.tabBuilder.build(tab));
        }
        this.tabGroupIconRenderer.render();

        this.addInteractions();

        this.revealActiveTab();
    }

    revealActiveTab() {
        const activeTab = document.querySelector('.tab.active');
        if (activeTab) {
            activeTab.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }

    updateTab(tabId, changeInfo, tab) {
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

    addInteractions() {
        addDraggable('.groups .tab');
        addDropTarget('.groups .tab', async (target, data) => {
            const targetData = target.dataset;
            await this.tabManager.moveTab(parseInt(data.tabId), parseInt(targetData.tabIndex));
        });

        addDropTarget('.group-icons .group-icon:not(.add-group)', async (target, data) => {
            const targetData = target.dataset;
            await this.tabManager.moveTabToGroup(parseInt(data.tabId), parseInt(targetData.groupId));
        });

        addDropTarget('.group-icons .add-group', async (target, data) => {
            this.tabManager.beginUpdate();
            const newGroup = await this.tabManager.createGroup("", [parseInt(data.tabId)]);
            await this.tabManager.setCurrentGroupId(newGroup);
            this.tabManager.endUpdate();
        });
    }
}