
const coloriser = document.getElementById("html5colorpicker");
const textValueSlider = document.getElementById("textValueSlider");
const blackListButton = document.getElementById("blackListButton");
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

chrome.storage.sync.get(['textColor', 'proportion'], ({ textColor, proportion }) => {
    coloriser.value = textColor;
    textValueSlider.value = proportion;
});

coloriser.addEventListener("input", () => {

    function syncColor() {
        const textColor = coloriser.value;
        chrome.storage.sync.set({ textColor }, loadChanges(addBionicStyles));
    }
    syncColor();
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
            const siteUrl = tabs[0].url.split('/')[2];
            if(computedValue.includes(siteUrl))
                chrome.storage.sync.set({ blacklist: computedValue.filter(url => url !== siteUrl) }, loadChanges(addBionicMarkup));
            else
                chrome.storage.sync.set({ blacklist: [...computedValue, siteUrl] }, loadChanges(addBionicMarkup));
        });
    });
}

function removeAllBlacklist()
{
    chrome.storage.sync.set({ blacklist: [] }, loadChanges(addBionicMarkup));
}


blackListButton.addEventListener("click", () => {
    blacklistCurrentToggle();
});