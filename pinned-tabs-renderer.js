import { buildTab } from "./tab-builder.js";
import { pinnedTabs } from "./tab-manager.js";

const pinnedTabsContainer = () => document.querySelector('.pinned-tabs');

const clearContainer = () => {
    pinnedTabsContainer().innerHTML = '';
}

export const renderPinnedTabs = () => {
    clearContainer();
    for (let x in pinnedTabs) {
        const tab = pinnedTabs[x];
        const tabElement = buildTab(tab, 'pinned');
        pinnedTabsContainer().appendChild(tabElement);
    }
}
