export default class TabBuilder {
    constructor(TabManager) {
        this.tabManager = TabManager;
    }

    build(tab, className) {
        const tabElement = this.createRootElement(tab, className);
        tabElement.appendChild(this.createIconElement(tab));
        tabElement.appendChild(this.createTitleElement(tab));
        tabElement.appendChild(this.createCloseElement(tab));

        this.addInteractions(tabElement, tab);
        return tabElement;
    }

    createRootElement(tab, className) {
        const tabElement = document.createElement('div');
        tabElement.classList.add('tab');
        if (tab.active) {
            tabElement.classList.add('active');
        }
        if (tab.status === 'loading') {
            tabElement.classList.add('loading');
        }
        tabElement.setAttribute('title', tab.url);
        tabElement.setAttribute('data-tab-id', tab.id);
        tabElement.setAttribute('data-tab-index', tab.index);
        tabElement.setAttribute('data-group-id', tab.groupId);

        if (className) {
            tabElement.classList.add(className);
        }

        return tabElement;
    }

    createTitleElement(tab) {
        const tabTitleElement = document.createElement('div');
        tabTitleElement.classList.add('tab-title');
        tabTitleElement.innerHTML = tab.title.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');

        return tabTitleElement;
    }

    createIconElement(tab) {
        const tabIconElement = document.createElement('img');
        tabIconElement.classList.add('tab-icon');
        if (tab.favIconUrl) {
            tabIconElement.src = tab.favIconUrl;
        }
        tabIconElement.setAttribute('title', tab.url);

        return tabIconElement;
    }

    createCloseElement(tab) {
        const tabCloseElement = document.createElement('span');
        tabCloseElement.classList.add('tab-close');
        tabCloseElement.innerHTML = '&times;';
        tabCloseElement.setAttribute('title', 'Close Tab');
        tabCloseElement.onclick = async function() {
            this.tabManager.beginUpdate();
            await this.tabManager.removeTab(tab.id);
            this.tabManager.endUpdate();
        }.bind(this);

        return tabCloseElement;
    }

    addInteractions(tabElement, tab) {
        tabElement.onclick = async function(e) {
            console.log(e);
            this.tabManager.beginUpdate()
            await this.tabManager.setActiveTab(tab.id);
            this.tabManager.endUpdate();
        }.bind(this);
        tabElement.ondblclick = async function() {
            if (tabElement.classList.contains('pinned')) {
                await this.tabManager.unpinTab(tab.id);
            }
            else {
                await this.tabManager.pinTab(tab.id);
            }
        }.bind(this);
    }
}