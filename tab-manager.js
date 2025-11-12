let tabs = [];
export let pinnedTabs = [];
export let nonPinnedTabs = [];
export let tabGroups = [];
let updateEvent;
let currentGroupId = -1;
let isUpdating = false;

export const createTabManager = async (aUpdateEvent) => {
    chrome.tabs.onUpdated.addListener(onTabUpdated);
    chrome.tabs.onRemoved.addListener(onTabRemoved);
    chrome.tabs.onCreated.addListener(onTabCreated);
    chrome.tabs.onActivated.addListener(onTabActivated);
    chrome.tabs.onMoved.addListener(onTabUpdated);
    updateEvent = aUpdateEvent;    
    await queryTabs();
}




export const queryTabs = async () => {
    tabs = await chrome.tabs.query({currentWindow: true});
    nonPinnedTabs = tabs.filter(tab => !tab.pinned);
    pinnedTabs = tabs.filter(tab => tab.pinned);
    tabGroups = await chrome.tabGroups.query({windowId: tabs[0].windowId});
    const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (activeTab) {
        currentGroupId = activeTab.groupId;
    }
    if (!tabGroups.find(g => g.id === -1)) {
        tabGroups.unshift({
            id: -1,
            title: 'Ungrouped',
            color: 'gray',
            active: currentGroupId === -1,
        })
    }
}

export const getCurrentGroupId = () => {
    return currentGroupId;
}

export const setCurrentGroupId = (groupId) => {
    const group = tabGroups.find(group => group.id === groupId);
    if (groupId !== -1 && group) {
        currentGroupId = groupId;
    } else {
        currentGroupId = -1;
    }
    if (updateEvent) {
        updateEvent();
    }
}

export const activeTabGroupId = () => {
    const [tab] = tabs.filter(tab => tab.active);
    if (tab) {
        return tab.groupId;
    }
    return -1;
}

export const updateActiveGroupId = () => {
    if (currentGroupId === activeTabGroupId()) {
        return;
    }
    setCurrentGroupId(activeTabGroupId());
}

export const getTabsByGroupId = () => {
    return tabs.filter(tab => tab.groupId === currentGroupId && !tab.pinned);
}

export const setActiveTab = async (tabId) => {
    await chrome.tabs.update(tabId, {active: true});
}

export const beginUpdate = () => {
    isUpdating = true;
}

export const endUpdate = () => {
    isUpdating = false;
    doUpdate();
}

export const doUpdateTab = (tabId, changeInfo, tab) => {
    if (isUpdating) {
        return;
    }
    if (updateEvent) {
        updateEvent(tabId, changeInfo, tab);
    }
}

export const doUpdate = () => {
    if (isUpdating) {
        return;
    }

    if (updateEvent) {
        updateEvent();
    }
}

export const createTab = async (url) => {
    const tab = await chrome.tabs.create({url: url});
    await queryTabs();
    doUpdate();
    return tab;
}

export const removeTab = async (tabId) => {
    await chrome.tabs.remove(tabId);
    await queryTabs();
    doUpdate();
}

export const pinTab = async (tabId) => {
    await chrome.tabs.update(tabId, {pinned: true});
    await queryTabs();
    doUpdate();
}

export const unpinTab = async (tabId) => {
    await chrome.tabs.update(tabId, {pinned: false});
    await queryTabs();
    doUpdate();
}

export const moveTab = async (tabId, newIndex) => {
    await chrome.tabs.move(tabId, {index: newIndex});
    await queryTabs();
    doUpdate();
}

export const moveTabToGroup = async (tabId, groupId) => {
    if (groupId === -1) {
        await removeTabFromGroup(tabId);
        return;
    }
    await chrome.tabs.group({tabIds: [tabId], groupId: groupId});
    await queryTabs();
    doUpdate();
}

export const removeGroup = async (groupId) => {
    const groupIdTabs = tabs.filter(tab => tab.groupId === groupId).map(t => t.id);
    chrome.tabs.remove(groupIdTabs);
    await queryTabs();
    doUpdate();
}

export const createGroup = async (groupName, tabIds) => {
    const groupId = await chrome.tabs.group({tabIds: tabIds});
    await chrome.tabGroups.update(groupId, {title: groupName});
    await queryTabs();
    doUpdate();
    return groupId;
}

export const removeTabFromGroup = async (tabId) => {
    await chrome.tabs.ungroup(tabId);
    await queryTabs();
    doUpdate();
}

export const onTabActivated = async (x, y) => {
    await queryTabs();
    currentGroupId = activeTabGroupId();
    doUpdate();
}

export const onTabUpdated = async (tabId, changeInfo, tab) => {
    if (tabId) {
        doUpdateTab(tabId, changeInfo, tab);
        return;
    }
    await queryTabs();
    doUpdate();
}

export const onTabRemoved = async () => {
    await queryTabs();
    currentGroupId = activeTabGroupId();
    doUpdate();
}

export const onTabCreated = async () => {
    await queryTabs();
    currentGroupId = activeTabGroupId();
    doUpdate();
}   

export const renameGroup = async (groupId, newName) => {
    await chrome.tabGroups.update(groupId, {title: newName});
    await queryTabs();
    doUpdate();
}

export const setGroupColor = async (groupId, color) => {
    await chrome.tabGroups.update(groupId, {color: color});
    await queryTabs();
    doUpdate();
}

export const tabGroupById = (id) => {
    return tabGroups.find(group => group.id === id);
}
