const btn = document.querySelector('.highlight-text');
const btn2 = document.querySelector('.download-text');


// this functions checks if something is highlighted and if there it, it takes it and saves it in the local storage
btn.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // var texts = JSON.parse(localStorage.getItem("selectedText"));
    // console.log("this is the text before", texts);

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: highlightText,
    }, async (injectionResluts) => {
        const [data] = injectionResluts;
        console.log(data.result);

        if (localStorage.getItem('selectedText') === null) {
            localStorage.setItem('selectedText', JSON.stringify(data.result));
            window.alert("Text has been saved");
        }
        else {
            var texts = JSON.parse(localStorage.getItem("selectedText"));
            texts.push(data.result[0]);
            console.log(texts);
            localStorage.setItem('selectedText', JSON.stringify(texts));
            window.alert("Text has been saved");
        }
    })
})


// this function checks if there is any selected text and if there is any,it returns the data
function highlightText() {
    try {
        let highlightedText = window.getSelection().toString();
        if (highlightedText) {
            const note = [];
            note.push(highlightedText);
            console.log(note);
            return note;
        }
        else { window.alert("Nothing is selected") }
    } catch (error) {
        console.error(error);
    }
}

// fucntion to download all the selected lines in a .txt fiels
btn2.addEventListener('click', async () => {
    const selected_texts = JSON.parse(localStorage.getItem('selectedText'));
    console.log(selected_texts);
    const link = document.createElement('a');
    const file = new Blob(selected_texts, { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "selected_texts.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    localStorage.clear();
})