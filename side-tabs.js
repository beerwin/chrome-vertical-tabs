import TabManager from "./tab-manager.js";
import TabRenderer from "./tab-renderer.js";

export default class SideTabs {
    constructor() {
        this.TabManager = new TabManager(this.onTabUpdated.bind(this));
        this.TabRenderer = new TabRenderer(this.TabManager);
        document.querySelector('#new-tab').onclick = this.onNewTab.bind(this);
        this.refreshTabs();
    }

    async refreshTabs() {
        await this.TabManager.queryTabs();
        this.TabManager.setCurrentGroupId(this.TabManager.activeTabGroupId());
        await this.TabRenderer.render();
    }

    async onTabUpdated(tabId, changeInfo, tab) {
        if (tabId) {
            this.TabRenderer.updateTab(tabId, changeInfo, tab);
            return;
        }
        await this.TabRenderer.render();
    }

    async onNewTab() {
        const currentGroupId = this.TabManager.getCurrentGroupId();
        this.TabManager.beginUpdate();
        const tab = await this.TabManager.createTab();
        await this.TabManager.moveTabToGroup(tab.id, currentGroupId);
        this.TabManager.endUpdate();
    }

}