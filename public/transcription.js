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
        const order_result_element = document.getElementById('order-result-text');
        order_result_element.innerHTML = `<div id="order-result-text" style="color: black">${orderResult}</div>`;
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
var cocktail_matrix;
setGlobalVariable();
async function setGlobalVariable() {
    try {
        const result = await get_all_cocktails_strings(); // Wait for the result of the async function
        cocktail_matrix = result; // Set the global variable
        console.log(cocktail_matrix); // Output: Async operation completed
    } catch (error) {
        console.error(error);
    }
}

function onTextChange(entireText) {//detect cocktail
    let result;
    let trimmedText = entireText.trim();
    trimmedText = trimmedText.replace(",", "");
    console.log(trimmedText);
    console.log(cocktail_matrix);
    for (let i = 0; i < cocktail_matrix.length; i++) {
        const cocktail = cocktail_matrix[i];
        if (containsAnyString(trimmedText, cocktail)) {
            result = cocktail;
        }
    }
    if (result !== undefined) {
        return result[0];
    } else {
        return result;
    }
}

function containsAnyString(str, array) {
    return array.some(item => str.includes(item.toLowerCase()));
}
