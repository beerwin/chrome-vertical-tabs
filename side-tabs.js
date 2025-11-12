import TabManager from "./tab-manager.js";
import { renderTabs, updateTab } from "./tab-renderer.js";

const refreshTabs = async (tabManager) => {
    await tabManager.queryTabs();
    tabManager.setCurrentGroupId(tabManager.activeTabGroupId());
    await renderTabs(tabManager);
}

export const sideTabs = () => {
    const tabManager = new TabManager(async (tabId, changeInfo, tab) => {
        if (tabId) {
            updateTab(tabId, changeInfo, tab);
            return;
        }
        await renderTabs(tabManager);
    });
    
    document.querySelector('#new-tab').onclick = async () => {
        const currentGroupId = tabManager.getCurrentGroupId();
        tabManager.beginUpdate();
        const tab = await tabManager.createTab();
        await tabManager.moveTabToGroup(tab.id, currentGroupId);
        tabManager.endUpdate();
    }

    refreshTabs(tabManager)
}
