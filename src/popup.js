
const coloriser = document.getElementById("html5colorpicker");
const textValueSlider = document.getElementById("textValueSlider");
const blackListButton = document.getElementById("blackListButton");
const storeSettingButton = document.getElementById("storeSettingButton");
//event on chrome load

function withCurrentTab(func) {
    chrome.tabs.query(
        { active: true, lastFocusedWindow: true },
        ([currentTab]) => {
            func(currentTab);
        }
    );
}

function loadChanges(func) {
    return () => {
        withCurrentTab(tab => {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: func,
            });
        });
    };
}

chrome.storage.sync.get(['textColor', 'proportion'], ({ textColor, proportion }) => {
    coloriser.value = textColor;
    textValueSlider.value = proportion;
});


coloriser.addEventListener("input", () => {
    const textColor = coloriser.value;
    coloriser.value = textColor;
    chrome.storage.sync.set({ textColor }, loadChanges(addBionicStyles));
}, false);


textValueSlider.addEventListener("change", () => {
    const proportion = textValueSlider.value;
    chrome.storage.sync.set({ proportion }, loadChanges(addBionicMarkup));
}, false);

function blacklistCurrentToggle() {
    withCurrentTab(tab => {
        withProp('blacklist', curBlacklist => {
            const newBlacklist = new Set(curBlacklist);
            const curTabDomain = new URL(tab.url).hostname;

            if (curBlacklist.has(curTabDomain))
                newBlacklist.delete(curTabDomain);
            else
                newBlacklist.add(curTabDomain);

            chrome.storage.sync.set({ blacklist: newBlacklist }, loadChanges(addBionicMarkup));
        });
    });
}


function storeCurrentSettingsLocal() {
    withCurrentTab(tab => {
        chrome.storage.sync.get(['textColor', 'proportion'], ({ textColor, proportion }) => {
            const curDomain = new URL(tab.url).hostname;
            const newSettings = {
                textColor,
                proportion
            }
            chrome.storage.local.get('settings', ({ settings: curSettingsList }) => {
                const newSettingsList = new Map(curSettingsList);
                newSettingsList.set(curDomain, newSettings);

                chrome.storage.local.set({ settings: newSettingsList }, loadChanges(addBionicMarkup));
            });
        });

    });
}

function resetAllSettings() {
    chrome.storage.local.set({ settings: new Map }, loadChanges(addBionicMarkup));
}

function removeAllBlacklist() {
    chrome.storage.sync.set({ blacklist: new Set }, loadChanges(addBionicMarkup));
}


blackListButton.addEventListener("click", blacklistCurrentToggle);

storeSettingButton.addEventListener("click", storeCurrentSettingsLocal);