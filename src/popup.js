let changeColor = document.getElementById("changeColor");
let coloriser = document.getElementById("html5colorpicker");
let textValueSlider = document.getElementById("textValueSlider");
//event on chrome load

coloriser.addEventListener("input", () => {
    const color = coloriser.value;
    chrome.storage.sync.set({ color });
}, false);


textValueSlider.addEventListener("input", () => {
    const textValue = textValueSlider.value;
    chrome.storage.sync.set({ textValue });
}, false);

changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBgColor,
    });
});