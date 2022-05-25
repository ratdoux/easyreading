const paragraph = document.getElementsByTagName('p');
const contentContainer = [];
let isLink = false;
let textValueSlider = 2;
chrome.storage.sync.get("textValue", ({ textValue }) => {
    textValueSlider = textValue;
    console.log(textValueSlider);
});

const tagsToCheck = (
    "abbr,area,audio,a,bdi,bdo,bgsound,br,b,canvas,cite,code,details,del,dfn,dialog,figcaption,figure,img,ins,i,kbd,map,mark,menu,menuitem,meter," +
    "output,progress,q,rp,rt,ruby,samp,small,source,span,strong,sub,summary,sup,s,time,track,u,var,video,wbr"
).split(',');

for (let i = 0; i < paragraph.length; i++) {
    contentContainer[i] = ''
    let matchTag = '';
    paragraph[i].innerHTML.trim().split(' ').forEach(word => {
        //check if word includes <a

        if ( tagsToCheck.some( tag => word.includes('<'+tag)) ) {
            matchTag = word.split('<')[1];
            matchTag.includes('>') && (matchTag = matchTag.split('>')[0]);
            isLink = true;
        }
        const temp = ('</' + matchTag + '>');
        if (word.includes(('</' + matchTag + '>'))) {

            isLink = false;
            contentContainer[i] += word + ' ';
            return;
        }
        //check if word contains &
        if (word.includes('&')) {
            contentContainer[i] += word + ' ';
            return;
        }

        if (matchTag.includes('>')) {
            isLink && (contentContainer[i] += matchTag.split('>')[1] + ' ');
        }
        else {
            isLink && (contentContainer[i] += word + ' ');
        }

        !isLink && (contentContainer[i] += `<b class="bold">${word.substring(0, Math.ceil(word.length / textValueSlider))}</b>`);
        !isLink && (contentContainer[i] += `<span>${word.substring(Math.ceil(word.length / textValueSlider), word.length)} </span>`);
    }
    );



}
for (let i = 0; i < contentContainer.length; i++) {
    const content = document.createElement('p')
    paragraph[i].className !== '' && (content.className = paragraph[i].className)
    paragraph[i].id !== '' && (content.id = paragraph[i].id)
    content.innerHTML = contentContainer[i];
    paragraph[i].replaceWith(content);
}


setPageBgColor();
