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
    orderResult !== null
  ) {
    orderResultDetected(orderResult);
    listenForConfirmation(entireTranscript);
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
  var normalizedText = normalizeText(entireText);
  console.log(normalizedText);
  //console.log(cocktail_matrix);
  let result;
  for (let i = 0; i < cocktail_matrix.length; i++) {
    const cocktail = cocktail_matrix[i]; //is array containing cocktail name and all synonyms
    if (containsAnyString(normalizedText, cocktail)) {
      result = cocktail;
    }
  }
  if (result !== undefined) {
    return result[0];
  } else {
    return null;
  }
}

function containsAnyString(str, array) {
  return array.some(item => str.includes(normalizeText(item)));
}

function normalizeText(text) {
  let modifiedText = text.toLowerCase();
  const regex = new RegExp(/-' /, "g");
  //remove - ' and *whitespace* (/s)
  modifiedText = modifiedText
    .replaceAll("-", "")
    .replaceAll("'", "")
    .replaceAll(/\s/g, "");
  //console.log(modifiedText);
  return modifiedText;
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

function listenForConfirmation(entireTranscript) {
  let normalizedTranscript = normalizeText(entireTranscript);
  if (normalizedTranscript.contains(normalizeText(engageString))) {
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
