export default class PinnedTabsRenderer {
    constructor(TabManager, tabBuilder) {
        this.tabManager = TabManager;
        this.pinnedTabsContainer = document.querySelector('.pinned-tabs');
        this.tabBuilder = tabBuilder;
    }

    clearContainer() {
        this.pinnedTabsContainer.innerHTML = '';
    }

    render() {
        this.clearContainer();
        for (let x in this.tabManager.pinnedTabs) {
            const tab = this.tabManager.pinnedTabs[x];
            const tabElement = this.tabBuilder.build(tab, 'pinned');
            this.pinnedTabsContainer.appendChild(tabElement);
        }
    }
}