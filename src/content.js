const targetNode = document.body;
const config = { attributes: true, childList: true, subtree: true };

const callback = function(mutationsList, observer) {
    const hasMutated = mutationsList.some(m => {
        const classes = [
            ...Array.from(m.addedNodes || []),
            ...Array.from(m.removedNodes || []),
        ].reduce((acc, cur) => [...acc, ...Array.from(cur.classList || [])], []);
        if (classes.includes(BIONIC_WORD) || classes.includes(BIONIC)) return false;
        return true;
    });
    if(hasMutated) {
        runAfterMutate();
    }
}

const observer = new MutationObserver(callback);

function observe() {
    observer.observe(targetNode, config);
}

function runAfterMutate() {
    observer.disconnect();
    run();
}


function run() {
    let computedValue;
    chrome.storage.sync.get('blacklist', blacklisted => {
        computedValue = blacklisted['blacklist'] || [];
        if(!computedValue.includes(window.location.hostname)) {
            addBionicMarkup();
            addBionicStyles(observe);
        }
    });
}
run();
observe();
