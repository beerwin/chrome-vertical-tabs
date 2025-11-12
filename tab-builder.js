import { fromTemplate } from "./src/js/templates.js";
import { 
    beginUpdate, 
    endUpdate, 
    setActiveTab, 
    pinTab, 
    unpinTab,
    removeTab,
} from "./tab-manager.js";

const tabTemplate = `
<div class="tab" title="{url}" data-tab-id="{id}" data-tab-index="{index}" data-group-id="{groupId}">
    <img class="tab-icon" src="{favIconUrl}" title="{url}" />
    <div class="tab-title">{title}</div>
    <span class="tab-close" title="Close Tab">&times;</span>
</div>
`

const addInteractions = (tabElement, tab) => {
    tabElement.onclick = async function(e) {
        beginUpdate()
        await setActiveTab(tab.id);
        endUpdate();
    };

    tabElement.ondblclick = async function() {
        if (tabElement.classList.contains('pinned')) {
            await unpinTab(tab.id);
        }
        else {
            await pinTab(tab.id);
        }
    }
}

export const buildTab = (tab, className) => {
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
        beginUpdate();
        await removeTab(tab.id);
        endUpdate();
    }

    addInteractions(tabElement, tab);
    return tabElement;
}
