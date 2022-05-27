
const coloriser = document.getElementById("html5colorpicker");
const textValueSlider = document.getElementById("textValueSlider");
const blackListButton = document.getElementById("blackListButton");
const storeSettingButton = document.getElementById("storeSettingButton");
//event on chrome load

function loadChanges(func) {
    return () => {
        chrome.tabs.query(
            { active: true, lastFocusedWindow: true },
            ([currentTab]) => {
                chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    function: func,
                });
            }
        );
    };
}



coloriser.addEventListener("input", () => {
    const textColor = coloriser.value;
    coloriser.value = textColor;
    chrome.storage.sync.set({ textColor }, loadChanges(addBionicStyles));
}, false);


textValueSlider.addEventListener("input", () => {
    const proportion = textValueSlider.value;
    chrome.storage.sync.set({ proportion }, loadChanges(addBionicMarkup));
}, false);

function blacklistCurrentToggle()
{
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        chrome.storage.sync.get('blacklist', ({blacklist}) => {
            const computedValue = blacklist || [];
            const currentTabUrl = tabs[0].url.split('/')[2];
            if(computedValue.includes(currentTabUrl))
                chrome.storage.sync.set({ blacklist: computedValue.filter(url => url !== currentTabUrl) }, loadChanges(addBionicMarkup));
            else
                chrome.storage.sync.set({ blacklist: [...computedValue, currentTabUrl] }, loadChanges(addBionicMarkup));
        });
    });
}


function storeCurrentSettingsLocal()
{
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {

        chrome.storage.sync.get(['textColor', 'proportion'], ({ textColor, proportion }) => {
            const newSettings = {
                textColor,
                proportion,
                url: tabs[0].url.split('/')[2]
            }
            chrome.storage.local.get('settings', ({ settings }) => {
                const settingsNullCheck = settings || [];
                //if settings url exists, replace it
                if(settingsNullCheck.find(setting => setting.url === newSettings.url))
                    chrome.storage.local.set({ settings: settingsNullCheck.map(setting => setting.url === newSettings.url ? newSettings : setting) }, loadChanges(addBionicMarkup));
                else
                    chrome.storage.local.set({ settings: [...settingsNullCheck, newSettings] }, loadChanges(addBionicMarkup));


            });
        });

    });
}

function resetAllSettings()
{
    chrome.storage.local.set({ settings: [] }, loadChanges(addBionicMarkup));
}

function removeAllBlacklist()
{
    chrome.storage.sync.set({ blacklist: [] }, loadChanges(addBionicMarkup));
}


blackListButton.addEventListener("click", () => {
    blacklistCurrentToggle();
});

storeSettingButton.addEventListener("click", () => {
    storeCurrentSettingsLocal();
});