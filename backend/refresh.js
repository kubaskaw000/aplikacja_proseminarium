import fs from "fs";

setInterval(() => {
  fs.writeFile("x.js", "const x = 1; export default x", function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
}, 5 * 60 * 1000);
