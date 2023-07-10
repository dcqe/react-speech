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

////////////////
//with normalization
function findIndexOfOccurrence(arrays, string) {
  const result = [];

  for (let i = 0; i < arrays.length; i++) {
    const row = arrays[i];

    for (let j = 0; j < row.length; j++) {
      const element = normalizeText(row[j]); //normalized element
      let lastIndex = -1;
      let index = string.indexOf(element);

      while (index !== -1) {
        lastIndex = index;
        index = string.indexOf(element, index + 1);
      }

      if (lastIndex !== -1) {
        result.push([lastIndex, row]);
        break;
      }
    }
  }

  return result;
}

/*const A = [
    ['apple', 'banana', 'cherry'],
    ['dog', 'elephant', 'fish'],
    ['cat', 'goat', 'horse'],
    ['ana']
];
const B = 'The cat is chasing the banana';

const pairs = findIndexOfOccurrence(A, B);
console.log(pairs);
*/

function findPairWithHighestNumber(pairs) {
  if (pairs.length === 0) {
    return null; // Return null if the array is empty
  }

  return pairs.reduce((maxPair, currentPair) => {
    const [maxNumber] = maxPair;
    const [currentNumber] = currentPair;

    return currentNumber > maxNumber ? currentPair : maxPair;
  });
}

//const pairWithHighestNumber = findPairWithHighestNumber(pairs);
//console.log(pairWithHighestNumber);
