const coloriser = document.getElementById("html5colorpicker");
const textValueSlider = document.getElementById("textValueSlider");
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
    const textColor = coloriser.value;
    chrome.storage.sync.set({ textColor }, loadChanges(addBionicStyles));
}, false);


textValueSlider.addEventListener("input", () => {
    const proportion = textValueSlider.value;
    chrome.storage.sync.set({ proportion }, loadChanges(addBionicMarkup));
}, false);