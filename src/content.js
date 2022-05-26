function run() {
    let computedValue;
    chrome.storage.sync.get('blacklist', storedConf => {
        computedValue = storedConf['blacklist'] || [];
        if(!computedValue.includes(window.location.hostname)) {
            addBionicMarkup();
            addBionicStyles();
        }
    });
}
run();
