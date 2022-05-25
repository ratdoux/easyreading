
const paragraph = document.getElementsByTagName('p');
const contentContainer = [];
let isLink = false;
let textValueSlider = 2;
chrome.storage.sync.get("textValue", ({ textValue }) => {
    textValueSlider = textValue;
    console.log(textValueSlider);
} );
const style= {
    color: 'red',
}

for(let i = 0; i < paragraph.length; i++)
{
        contentContainer[i] = ''
        let matchTag = '';
        paragraph[i].innerHTML.trim().split(' ').forEach(word =>
            {
                //check if word includes <a

                if(word.includes('<a') || word.includes('<code') || word.includes('<sup') || word.includes('<span') || word.includes('<del') || word.includes('<ins') ||  word.includes('<time') || word.includes('<abbr') || word.includes('<b') || word.includes('<i') || word.includes('<strong') || word.includes('<small') || word.includes('<sub') || word.includes('<sup') || word.includes('<u') || word.includes('<s') || word.includes('<cite') || word.includes('<q') || word.includes('<dfn') || word.includes('<var') || word.includes('<kbd') || word.includes('<samp') || word.includes('<mark') || word.includes('<bdi') || word.includes('<bdo') || word.includes('<ruby') || word.includes('<rt') || word.includes('<rp') || word.includes('<bgsound') || word.includes('<br') || word.includes('<wbr') || word.includes('<ins') || word.includes('<del') || word.includes('<img') || word.includes('<map') || word.includes('<area') || word.includes('<audio') || word.includes('<video') || word.includes('<source') || word.includes('<track') || word.includes('<canvas') || word.includes('<figcaption') || word.includes('<figure') || word.includes('<details') || word.includes('<summary') || word.includes('<dialog') || word.includes('<menu') || word.includes('<menuitem') || word.includes('<meter') || word.includes('<progress') || word.includes('<output') || word.includes('<progress') || word.includes('<details') || word.includes('<summary') || word.includes('<dialog') || word.includes('<menu') || word.includes('<menuitem') || word.includes('<meter') || word.includes('<progress') || word.includes('<output') || word.includes('<progress') || word.includes('<details') || word.includes('<summary') || word.includes('<dialog') || word.includes('<menu') )
                {
                    matchTag=word.split('<')[1];
                    matchTag.includes('>') && (matchTag = matchTag.split('>')[0]);
                    isLink = true;
                }
                const temp = ('</'+ matchTag + '>');
                if(word.includes( ('</'+ matchTag + '>') ))
                {

                    isLink = false;
                    contentContainer[i] += word + ' ';
                    return;
                }
                //check if word contains &
                if(word.includes('&'))
                {
                    contentContainer[i] += word + ' ';
                    return;
                }

                if(matchTag.includes('>'))
                {
                    isLink && (contentContainer[i] += matchTag.split('>')[1] + ' ');
                }
                else
                {
                    isLink && (contentContainer[i] += word + ' ');
                }

                !isLink && (contentContainer[i] += `<b class="bold">${word.substring(0, Math.ceil(word.length / textValueSlider))}</b>`);
                !isLink && (contentContainer[i] += `<span>${word.substring(Math.ceil(word.length / textValueSlider), word.length)} </span>`);
            }
        );



}
for(let i = 0; i < contentContainer.length; i++)
{
        const content = document.createElement('p')
        paragraph[i].className !== '' && (content.className = paragraph[i].className)
        paragraph[i].id !== '' && (content.id = paragraph[i].id)
        content.innerHTML = contentContainer[i];
        paragraph[i].replaceWith(content);
}


let bold = document.getElementsByClassName("bold");
chrome.storage.sync.get("color", ({ color }) => {
    for (let i = 0; i < bold.length; i++) {
        bold[i].style.color = color;
    }
});

