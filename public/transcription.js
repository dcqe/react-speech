



// Create a SpeechRecognition object
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

// Set parameters for the recognition
recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = 0; i < event.results.length; ++i) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
            finalTranscript += text;
        } else {
            interimTranscript += text;
        }
    }

    const transcriptionElement = document.getElementById('transcription');
    transcriptionElement.innerHTML = `<div  class="interim">${interimTranscript}</div ><div  class="final">${finalTranscript}</div >`;
    let orderResult = onTextChange(finalTranscript + interimTranscript)
    const logElem = document.getElementById('log');
    logElem.innerHTML = orderResult;
    if (orderResult !== "" && orderResult !== null && orderResult !== 0) {
        console.log(orderResult);
    }
};

recognition.onend = () => {
    // Restart the recognition when it ends
    recognition.start();
};

recognition.start();

recognition.onstart = () => {
    const logElem = document.getElementById('log');
    logElem.innerHTML = `<div class="log">recognition started</div >`;
}

/////////////

function onTextChange(entireText) {//detect cocktail
    let trimmedText = entireText.trim();
    trimmedText = trimmedText.replace(",", "");
    console.log(trimmedText);
    for (var i = 0; i < cocktailList.length; i++) {
        var cocktail = cocktailList[i];
        if (includedIn(cocktail, trimmedText)) {
            return cocktail
        }
    }
    return null;
}

function includedIn(cocktail, text) {
    const lowerText = String(text).toLowerCase()
    console.log(lowerText)
    return lowerText.includes(cocktail.id) || lowerText.includes(String(cocktail.name).toLowerCase());
}

