import TabManager from "./tab-manager.js";
import { renderTabs, updateTab } from "./tab-renderer.js";

export default class SideTabs {
    constructor() {
        this.TabManager = new TabManager(this.onTabUpdated.bind(this));
        document.querySelector('#new-tab').onclick = this.onNewTab.bind(this);
        this.refreshTabs();
    }

    async refreshTabs() {
        await this.TabManager.queryTabs();
        this.TabManager.setCurrentGroupId(this.TabManager.activeTabGroupId());
        await renderTabs(this.TabManager);
    }

    async onTabUpdated(tabId, changeInfo, tab) {
        if (tabId) {
            updateTab(tabId, changeInfo, tab);
            return;
        }
        await renderTabs(this.TabManager);
    }

    async onNewTab() {
        const currentGroupId = this.TabManager.getCurrentGroupId();
        this.TabManager.beginUpdate();
        const tab = await this.TabManager.createTab();
        await this.TabManager.moveTabToGroup(tab.id, currentGroupId);
        this.TabManager.endUpdate();
    }

}