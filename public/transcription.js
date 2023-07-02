// Create a SpeechRecognition object
const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition)();

// Set parameters for the recognition
recognition.lang = "en-US";
recognition.continuous = true;
recognition.interimResults = true;

const engageString = "engage";

recognition.onresult = event => {
    let interimTranscript = "";
    let finalTranscript = "";
    let entireTranscript;

    for (let i = 0; i < event.results.length; ++i) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
            finalTranscript += text;
        } else {
            interimTranscript += text;
        }
    }
    entireTranscript = finalTranscript + interimTranscript;

    const transcriptionElement = document.getElementById("transcription");
    transcriptionElement.innerHTML = `<div class="interim">${interimTranscript}</div><div class="final">${finalTranscript}</div>`;

    let orderResult = onTextChange(entireTranscript);
    const logElem = document.getElementById("log");
    logElem.innerHTML = orderResult;
    if (
        orderResult !== "" &&
        orderResult !== null &&
        orderResult !== 0 &&
        orderResult !== [] &&
        orderResult !== undefined
    ) {
        orderResultDetected(orderResult);
        checkForConfirmation(entireTranscript);
    }
};

recognition.onend = () => {
    // Restart the recognition when it ends
    recognition.start();
};

recognition.start();

recognition.onstart = () => {
    const logElem = document.getElementById("log");
    logElem.innerHTML = `<div class="log">recognition started</div >`;
};

/////////////
var cocktail_matrix;
setGlobalVariable();

async function setGlobalVariable() {
    try {
        const result = await get_all_cocktails_strings(); // Wait for the result of the async function
        cocktail_matrix = result; // Set the global variable
        //console.log(cocktail_matrix); // Output: Async operation completed
    } catch (error) {
        console.error(error);
    }
}

function onTextChange(entireText) {
    //detect cocktail
    //let trimmedText = entireText.trim();
    //trimmedText = trimmedText.replace(",", "").replace("-", "");
    const normalizedText = normalizeText(entireText);
    //console.log(normalizedText);
    //console.log(cocktail_matrix);

    let allOccurrences = findIndexOfOccurrence(cocktail_matrix, normalizedText);
    if (allOccurrences.length === 0) {
        return "";
    } else {
        return findPairWithHighestNumber(allOccurrences)[1];
    }
}

function orderResultDetected(orderResult) {
    //display order result
    console.log(orderResult);
    const order_result_element = document.getElementById("order-result-text");
    order_result_element.innerHTML = `<div id="order-result-text" style="color: black">${orderResult}</div>`;

    //ask for confirmation
    const confirmationElement = document.getElementById("confirm-order");
    confirmationElement.innerHTML = `<div id="confirm-order" style="font-size: 16px">Order detected! To receive your drink please confirm your order by saying: </div>`;
    const engageElement = document.getElementById("engage-container");
    engageElement.innerHTML = `<div id="engage-container" style="font-size: 22px; font-weight: bold;">${engageString}</div>`;
}

function checkForConfirmation(entireTranscript) {
    let normalizedTranscript = normalizeText(entireTranscript);
    if (normalizedTranscript.includes(normalizeText(engageString))) {
        finalizeOrder();
    }
}

function finalizeOrder() {
    //remove asking for confirmation html
    const confirmationElement = document.getElementById("confirm-order");
    confirmationElement.innerHTML = `<div id="confirm-order" style="font-size: 16px"></div>`;
    const engageElement = document.getElementById("engage-container");
    engageElement.innerHTML = `<div id="engage-container" style="font-size: 22px; font-weight: bold;"></div>`;

    //display order success
    const successElement = document.getElementById("success-container");
    successElement.innerHTML = `<div id="success-container" style="font-size: 14px">You successfully ordered your drink. It should be ready shortly.</div>`;
}
