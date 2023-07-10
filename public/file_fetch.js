/*
// Get the URL of the currently opened HTML file
const currentURL = window.location.href;

// Print the URL
console.log("Current URL:", currentURL);

const params = new URLSearchParams(new URL(currentURL).search);

// Extract and print the arguments
console.log("Arguments:");
for (const [key, value] of params) {
  console.log(key, ":", value);

  fetch(value)
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error(
          "Error fetching the file. Status code: " + response.status
        );
      }
    })
    .then(fileContents => {
      console.log("File Contents:");
      console.log(fileContents);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}
  */

async function get_all_cocktails_strings() {
  const cocktail_json_path = "cocktails.json";
  const fileContent = await fetchFileAndSaveContent(cocktail_json_path);
  console.log(fileContent);
  const json_obj = JSON.parse(fileContent);
  console.log(json_obj);

  let cocktail_string_matrix = [];
  let this_cocktail_array;
  for (let i = 0; i < json_obj.length; i++) {
    this_cocktail_array = [];
    this_cocktail_array.push(json_obj[i]["name"]);
    var syns = json_obj[i]["synonyms"];
    if (syns !== undefined) {
      for (let j = 0; j < syns.length; j++) {
        this_cocktail_array.push(syns[j]);
      }
    }
    cocktail_string_matrix.push(this_cocktail_array);
  }
  console.log(cocktail_string_matrix);
  return cocktail_string_matrix;
}

async function fetchFileAndSaveContent(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const fileContent = await response.text();

    return fileContent;
  } catch (error) {
    console.error("Error:", error);
  }
}
