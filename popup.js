const btn = document.querySelector('.highlight-text');
const btn2 = document.querySelector('.download-text');

btn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: highlightText,
    })
})

// function that stores selected texts in the local storage and highlights the selected text
function highlightText() {
    try {
        // getting the selected text
        let highlightedText = window.getSelection().toString();
        if (highlightedText) {
            highlightedText = highlightedText + "\n\n";
            const note = [];
            note.push(highlightedText);
            //storing the text in the local storage
            if (localStorage.getItem('selectedText') === null) {
                localStorage.setItem('selectedText', JSON.stringify(note));
            }
            else {
                var texts = JSON.parse(localStorage.getItem("selectedText"));
                texts = [...texts, highlightedText]
                localStorage.setItem('selectedText', JSON.stringify(texts));
                window.alert("Text has been saved");
            }

            // highlights the selected text
            var selectedText = window.getSelection().toString();
            if (selectedText) {
                var newNode = document.createElement("mark");
                newNode.appendChild(document.createTextNode(selectedText));
                window.getSelection().getRangeAt(0).surroundContents(newNode);
            }
        }

        // no text is highlighted
        else { window.alert("Nothing is selected") }
    } catch (error) {
        console.error(error);
    }
}



// fucntion to download all the selected lines in a .txt fiels
btn2.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: downloadText,
    })

})

// fucntion to download all the selected lines in a .txt fiels
function downloadText() {
    const selected_texts = JSON.parse(localStorage.getItem('selectedText'));
    const link = document.createElement('a');
    const file = new Blob(selected_texts, { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "selected_texts.txt";
    link.click();
    URL.revokeObjectURL(link.href);


    console.log("csv")
    // saving data in xls format
    var ws_name = "seletctedText";//"SheetJS";
    var wb = new Workbook(), ws = sheet_from_array_of_arrays(selected_texts);
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename + ".xlsx")
}




// var mySentence = "Software is a set of computer programs";
// var allText = document.body.textContent;
// var index = allText.search(mySentence);
// if (index !== -1) {
//     console.log("The sentence '" + mySentence + "' was found in the web page at index " + index);
// } else {
//     console.log("The sentence '" + mySentence + "' was not found in the web page.");
// }