let cocktail_matrix;

// Create a SpeechRecognition object
const recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition ||
  window.oSpeechRecognition)();

// Set parameters for the recognition
recognition.lang = "en-US";
recognition.continuous = true;
recognition.interimResults = true;
//recognition.maxAlternatives = 5;

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
  console.log(entireTranscript);
  
  let orderResultPair = onTextChange(entireTranscript);
  let orderIndex = orderResultPair[0];
  let orderResult = orderResultPair[1][0];
  console.log(orderResult);

  //const logElem = document.getElementById("log");
  //logElem.innerHTML = orderResult;
  if (orderIndex !== -1) {
    orderResultDetected(orderResult);
    checkForConfirmation(entireTranscript, orderIndex);
  }
  return 0;
};

recognition.onend = () => {
  // Restart the recognition when it ends
  recognition.start();
};

recognition.start();

recognition.onstart = () => {
  setGlobalVariable().then();
};


async function setGlobalVariable() {
  try {
    cocktail_matrix = await get_all_cocktails_strings(); // Set the global variable
  } catch (error) {
    console.error(error);
  }
}

function onTextChange(entireText) {
  //returns cocktail name and last index of detection
  const normalizedText = normalizeText(entireText);
  let allOccurrences = findIndexOfOccurrence(cocktail_matrix, normalizedText);
  if (allOccurrences.length === 0) {
    return [-1, [""]];
  } else {
    return findPairWithHighestNumber(allOccurrences);
  }
}

function orderResultDetected(orderResult) {
  const order_result_element = document.getElementById("order-result-text");
  order_result_element.innerHTML = `<div id="order-result-text" style="color: black">${orderResult}</div>`;

  //ask for confirmation
  const confirmationElement = document.getElementById("confirm-order");
  confirmationElement.innerHTML = `<div id="confirm-order" style="font-size: 16px">Order detected! To receive your drink please confirm your order by saying: </div>`;
  const confirmButton = document.getElementById("order-now-button");
  confirmButton.style.display = 'inline';
  const engageElement = document.getElementById("engage-container");
  engageElement.innerHTML = `<div id="engage-container" style="font-size: 22px; font-weight: bold;">${engageString}</div>`;
}

function checkForConfirmation(entireTranscript, orderIndex) {
  let normalizedTranscript = normalizeText(entireTranscript);
  //check if engage was mentioned after latest cocktail
  if (normalizedTranscript.lastIndexOf(normalizeText(engageString)) > orderIndex) {
    finalizeOrder();
  }
}

function finalizeOrder() {
  //remove asking for confirmation html
  const confirmationElement = document.getElementById("confirm-order");
  confirmationElement.innerHTML = `<div id="confirm-order" style="font-size: 16px"></div>`;
  const engageElement = document.getElementById("engage-container");
  engageElement.innerHTML = `<div id="engage-container" style="font-size: 22px; font-weight: bold;"></div>`;
  const confirmButton = document.getElementById("order-now-button");
  confirmButton.style.display = 'none';

  //display order success
  const successElement = document.getElementById("success-container");
  successElement.innerHTML = `<div id="success-container" style="font-size: 14px">You successfully ordered your drink. It should be ready shortly.</div>`;
}

function onOrderConfirmPress() {
  finalizeOrder();
}
