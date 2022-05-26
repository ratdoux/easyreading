const targetNode = document.body;
const config = { attributes: true, childList: true, subtree: true };

const callback = function(mutationsList, observer) {
    let hasMutated = false;
    for(let mutation of mutationsList) {
        if(!(mutation.target.classList.contains('bionic') || mutation.target.classList.contains('bionic-word'))) {
            hasMutated = true;
            console.log(mutation);
        }
    }
    if(hasMutated) {
        console.log('mutation detected');
        runAfterMutate();
    }
}
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

function runAfterMutate() {
    observer.disconnect();
    run();
    //cant figure out how to reconnect the observer after running once without triggering an infinite loop, theres some async stuff going on
}


function run() {
    let computedValue;
    chrome.storage.sync.get('blacklist', blacklisted => {
        computedValue = blacklisted['blacklist'] || [];
        if(!computedValue.includes(window.location.hostname)) {
            addBionicMarkup();
            addBionicStyles();
        }
    });
}

