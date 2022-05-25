function setPageBgColor() {
    const boldElems = [...document.getElementsByClassName("bold")];

    chrome.storage.sync.get("color", ({ color }) => {
        boldElems.forEach(elem => {
            elem.style.color = color;
        });
    });
}