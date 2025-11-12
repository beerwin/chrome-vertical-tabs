import { buildTab } from "./tab-builder.js";

const pinnedTabsContainer = () => document.querySelector('.pinned-tabs');

const clearContainer = () => {
    pinnedTabsContainer().innerHTML = '';
}

export const renderPinnedTabs = (tabManager) => {
    clearContainer();
    for (let x in tabManager.pinnedTabs) {
        const tab = tabManager.pinnedTabs[x];
        const tabElement = buildTab(tab, 'pinned', tabManager);
        pinnedTabsContainer().appendChild(tabElement);
    }
}
