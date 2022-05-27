const defaultConf = {
    textColor: 'red',
    proportion: 0.5,
    blacklist: []
}


function withProp(key, func) {
    chrome.storage.local.get('settings', ({ settings }) => {
        const settingsNullCheck = settings || [];
        const currentTabUrl = window.location.toString().split('/')[2];
        const currentSettings = settingsNullCheck.find(setting => currentTabUrl.includes(setting.url));
        if(currentSettings)
        {
            const computedValue = currentSettings[key] || defaultConf[key];
            func(computedValue);
        }
        else
        {
            chrome.storage.sync.get(key, storedConf => {
                const computedValue = storedConf[key] || defaultConf[key];
                func(computedValue);
            });
        }
    });







}

const BIONIC_WORD = "bionic-word";
const BIONIC = "bionic";

function addBionicMarkup(callback) {
    withProp('proportion', proportion => {
        function makeBionic(word) {
            const bionicWord = document.createElement('span');
            bionicWord.className = BIONIC_WORD;

            const bionicPart = document.createElement('b');
            bionicPart.className = BIONIC;

            const splitIndex = Math.round(0.5 + proportion * (word.length - 1));
            bionicPart.textContent = word.substring(0, splitIndex);
            const restOfWord = document.createTextNode(word.substring(splitIndex) + ' ');

            bionicWord.appendChild(bionicPart);
            bionicWord.appendChild(restOfWord);

            return bionicWord;
        }

        function addBionicMarkupTo(node) {
            switch (node.nodeType) {
                case Node.ELEMENT_NODE:
                    if (node.className == BIONIC_WORD)
                        node.replaceWith(makeBionic(node.textContent.trim()));
                    else
                        [...node.childNodes].forEach(addBionicMarkupTo);
                    break;
                case Node.TEXT_NODE:
                    const words = node.textContent.trim().split(' ');
                    const bionicWords = words.map(makeBionic);

                    node.replaceWith(...bionicWords);
                    break;
            }
        }

        const paragraphs = document.getElementsByTagName('p');
        [...paragraphs].forEach(addBionicMarkupTo);

        if (callback) callback();
    });
}

function addBionicStyles(callback) {
    withProp('textColor', textColor => {
        const bionicParts = document.getElementsByClassName(BIONIC);

        [...bionicParts].forEach(bionicPart => {
            bionicPart.style.color = textColor;
        });

        if (callback) callback();
    });
}
