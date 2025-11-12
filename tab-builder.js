import { fromTemplate } from "./templates.js";

const tabTemplate = `
<div class="tab" title="{url}" data-tab-id="{id}" data-tab-index="{index}" data-group-id="{groupId}">
    <img class="tab-icon" src="{favIconUrl}" title="{url}" />
    <div class="tab-title">{title}</div>
    <span class="tab-close" title="Close Tab">&times;</span>
</div>
`

const addInteractions = (tabElement, tab, tabManager) => {
    tabElement.onclick = async function(e) {
        console.log(e);
        tabManager.beginUpdate()
        await tabManager.setActiveTab(tab.id);
        tabManager.endUpdate();
    };

    tabElement.ondblclick = async function() {
        if (tabElement.classList.contains('pinned')) {
            await tabManager.unpinTab(tab.id);
        }
        else {
            await tabManager.pinTab(tab.id);
        }
    }
}

export const buildTab = (tab, className, tabManager) => {
    const tabElement = fromTemplate(tabTemplate, {
        url: tab.url,
        id: tab.id,
        index: tab.index,
        groupId: tab.groupId,
        favIconUrl: tab.favIconUrl || '',
        title: tab.title.replace(/</gi, '&lt;').replace(/>/gi, '&gt;')
    });
    
    if (className) {
        tabElement.classList.add(className);
    }
    if (tab.active) {
        tabElement.classList.add('active');
    }
    if (tab.status === 'loading') {
        tabElement.classList.add('loading');
    }

    const closeElement = tabElement.querySelector('.tab-close');

    closeElement.onclick = async function(e) {
        e.stopPropagation();
        tabManager.beginUpdate();
        await tabManager.removeTab(tab.id);
        tabManager.endUpdate();
    }

    addInteractions(tabElement, tab, tabManager);
    return tabElement;
}
