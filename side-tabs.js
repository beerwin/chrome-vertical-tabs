import {
    createTabManager, 
    queryTabs, 
    activeTabGroupId, 
    getCurrentGroupId,
    setCurrentGroupId,
    beginUpdate, 
    endUpdate,
    createTab,
    moveTabToGroup,
} from "./tab-manager.js";
import { renderTabs, updateTab } from "./tab-renderer.js";

const refreshTabs = async () => {
    await queryTabs();
    setCurrentGroupId(activeTabGroupId());
    await renderTabs();
}

export const sideTabs = () => {
    createTabManager(async (tabId, changeInfo, tab) => {
        if (tabId) {
            updateTab(tabId, changeInfo, tab);
            return;
        }
        await renderTabs();
    });
    
    document.querySelector('#new-tab').onclick = async () => {
        const currentGroupId = getCurrentGroupId();
        beginUpdate();
        const tab = await createTab();
        await moveTabToGroup(tab.id, currentGroupId);
        endUpdate();
    }

    refreshTabs()
}
