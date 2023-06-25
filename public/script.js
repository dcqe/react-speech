
console.log("!!!!!!!!!!!!!!!!!!!!!!!!")


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
                throw new Error("Error fetching the file. Status code: " + response.status);
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
