Object.defineProperty(window, "speak", {
  get: function() {
    console.log("hey");
    const input = prompt("speech");
    let result = onTextChange(input);
    console.log(input);
    console.log(result);
  }
});
