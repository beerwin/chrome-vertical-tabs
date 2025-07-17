export default class TabManager {
    constructor(updateEvent) {
        this.tabs = [];
        this.pinnedTabs = [];
        this.nonPinnedTabs = [];
        this.tabGroups = [];
        chrome.tabs.onUpdated.addListener(this.onTabUpdated.bind(this));
        chrome.tabs.onRemoved.addListener(this.onTabRemoved.bind(this));
        chrome.tabs.onCreated.addListener(this.onTabCreated.bind(this));
        chrome.tabs.onActivated.addListener(this.onTabActivated.bind(this));
        chrome.tabs.onMoved.addListener(this.onTabUpdated.bind(this));
        this.updateEvent = updateEvent;
        this.currentGroupId = -1;
    }

    async queryTabs() {
        this.tabs = await chrome.tabs.query({currentWindow: true});
        this.nonPinnedTabs = this.tabs.filter(tab => !tab.pinned);
        this.pinnedTabs = this.tabs.filter(tab => tab.pinned);
        this.tabGroups = await chrome.tabGroups.query({windowId: this.tabs[0].windowId});
        const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
        if (activeTab) {
            this.currentGroupId = activeTab.groupId;
        }
        if (!this.tabGroups.find(g => g.id === -1)) {
            this.tabGroups.unshift({
                id: -1,
                title: 'Ungrouped',
                color: 'gray',
                active: this.currentGroupId === -1,
            })
        }
    }

    getCurrentGroupId() {
        return this.currentGroupId;
    }

    setCurrentGroupId(groupId) {
        const group = this.tabGroups.find(group => group.id === groupId);
        if (groupId !== -1 && group) {
            this.currentGroupId = groupId;
        } else {
            this.currentGroupId = -1;
        }
        if (this.updateEvent) {
            this.updateEvent();
        }
    }

    activeTabGroupId() {
        const [tab] = this.tabs.filter(tab => tab.active);
        if (tab) {
            return tab.groupId;
        }
        return -1;
    }

    updateActiveGroupId() {
        if (this.currentGroupId === this.activeTabGroupId()) {
            return;
        }
        this.setCurrentGroupId(this.activeTabGroupId);
    }

    getTabsByGroupId() {
        return this.tabs.filter(tab => tab.groupId === this.currentGroupId && !tab.pinned);
    }

    async setActiveTab(tabId) {
        await chrome.tabs.update(tabId, {active: true});
    }

    beginUpdate() {
        this.isUpdating = true;
    }

    endUpdate() {
        this.isUpdating = false;
        this.doUpdate();
    }

    doUpdateTab(tabId, changeInfo, tab) {
        if (this.isUpdating) {
            return;
        }
        if (this.updateEvent) {
            this.updateEvent(tabId, changeInfo, tab);
        }
    }

    doUpdate() {
        if (this.isUpdating) {
            return;
        }

        if (this.updateEvent) {
            this.updateEvent();
        }
    }

    async createTab(url) {
        const tab = await chrome.tabs.create({url: url});
        await this.queryTabs();
        this.doUpdate();
        return tab;
    }

    async removeTab(tabId) {
        await chrome.tabs.remove(tabId);
        await this.queryTabs();
        this.doUpdate();
    }
    async pinTab(tabId) {
        await chrome.tabs.update(tabId, {pinned: true});
        await this.queryTabs();
        this.doUpdate();
    }
    async unpinTab(tabId) {
        await chrome.tabs.update(tabId, {pinned: false});
        await this.queryTabs();
        this.doUpdate();
    }
    async moveTab(tabId, newIndex) {
        await chrome.tabs.move(tabId, {index: newIndex});
        await this.queryTabs();
        this.doUpdate();
    }
    async moveTabToGroup(tabId, groupId) {
        if (groupId === -1) {
            await this.removeTabFromGroup(tabId);
            return;
        }
        await chrome.tabs.group({tabIds: [tabId], groupId: groupId});
        await this.queryTabs();
        this.doUpdate();
    }
    async removeGroup(groupId) {
        const groupIdTabs = this.tabs.filter(tab => tab.groupId === groupId).map(t => t.id);
        chrome.tabs.remove(groupIdTabs);
        await this.queryTabs();
        this.doUpdate();
    }
    async createGroup(groupName, tabIds) {
        const groupId = await chrome.tabs.group({tabIds: tabIds});
        await chrome.tabGroups.update(groupId, {title: groupName});
        await this.queryTabs();
        this.doUpdate();
        return groupId;
    }
    async removeTabFromGroup(tabId) {
        await chrome.tabs.ungroup(tabId);
        await this.queryTabs();
        this.doUpdate();
    }

    async onTabActivated(x, y) {
        await this.queryTabs();
        this.currentGroupId = this.activeTabGroupId();
        this.doUpdate();
    }
    async onTabUpdated(tabId, changeInfo, tab) {
        if (tabId) {
            this.doUpdateTab(tabId, changeInfo, tab);
            return;
        }
        await this.queryTabs();
        this.doUpdate();
    }
    async onTabRemoved() {
        await this.queryTabs();
        this.currentGroupId = this.activeTabGroupId();
        this.doUpdate();
    }
    async onTabCreated() {
        await this.queryTabs();
        this.currentGroupId = this.activeTabGroupId();
        this.doUpdate();
    }   
    async renameGroup(groupId, newName) {
        await chrome.tabGroups.update(groupId, {title: newName});
        await this.queryTabs();
        this.doUpdate();
    }

    async setGroupColor(groupId, color) {
        await chrome.tabGroups.update(groupId, {color: color});
        await this.queryTabs();
        this.doUpdate();
    }

    tabGroupById(id) {
        return this.tabGroups.find(group => group.id === id);
    }
}