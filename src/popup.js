let changeColor = document.getElementById("changeColor");
let color = 'red';
let textValue;
let coloriser = document.getElementById("html5colorpicker");
let textValueSlider = document.getElementById("textValueSlider");
//event on chrome load

coloriser.addEventListener("change", function() {
    color = coloriser.value;
    chrome.storage.sync.set({ color });
}, false);


textValueSlider.addEventListener("change", function() {
    textValue = textValueSlider.value;
    chrome.storage.sync.set({ textValue });
}, false);




changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });



    function setPageBackgroundColor() {
        let bold = document.getElementsByClassName("bold");
        chrome.storage.sync.get("color", ({ color }) => {
            for (let i = 0; i < bold.length; i++) {
                bold[i].style.color = color;
            }
        });
    }

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: setPageBackgroundColor,
    });
});