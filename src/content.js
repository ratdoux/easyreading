const targetNode = document.body;
const config = { attributes: true, childList: true, subtree: true };

function onMutate(mutationRecords, observer) {
    const hasMutated = mutationRecords.some(mutationRecord =>
        [
            ...mutationRecord.addedNodes,
            ...mutationRecord.removedNodes
        ].every(node => !node.classList ||
            !node.classList.contains(BIONIC_WORD) &&
            !node.classList.contains(BIONIC)
        )
    );
    if (hasMutated) {
        observer.disconnect();
        run();
    }
}

const observer = new MutationObserver(onMutate);

function observe() {
    observer.observe(targetNode, config);
}

function run() {
    chrome.storage.sync.get('blacklist', ({ blacklist }) => {
        const computedBlacklist = new Set(blacklist || []);
        if (!computedBlacklist.has(window.location.hostname)) {
            addBionicMarkup();
            addBionicStyles(observe);
        }
    });
}

run();
observe();
