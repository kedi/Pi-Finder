const fs = require("fs");

const express = require("express");
const app = express();
let PIString = "";


app.set("view engine", "ejs");
app.use("/public", express.static("public"));

app.get("/", async(err, res) => {

    res.render("homePage");

});

/**
 * The path to recieve get requests with a parameter of the string to search in Pi.
 */
app.get("/get/:digits", (request, response) => {

    const search = request.params.digits;

    let index = getIndexNumber(PIString, search);

    if (search == `3`) {

        index = 10;

    }

    const text = index > 0 ? PIString.slice(index + search.length).slice(0, 15) : "";
    const reverseText = index > 0 ? PIString.split("").
      reverse().
      join("").
      slice(PIString.length - (index + search.length) + search.length).
      slice(0, 15).
      split("").
      reverse().
      join("") : "";

    /**
     * Wrapped as an object, sent as callback data.
     */
    response.send({indexOf: index - 1,
        strAfter: text,
        reverse: reverseText});

});

const stream = fs.createReadStream("pi-million.txt");

stream.on("data", (partialData) => {

    PIString += partialData;

});

stream.on("end", () => {

    console.log("Ended to load PI.");

});

app.listen(process.env.PORT || 3000, () => console.log(`Port has been started listening at ${process.env.PORT || 3000}`));

/**
 * 
 * @param {string} txt The whole string to make search in.
 * @param {string} search The string to find index in the text.
 */
function getIndexNumber(txt, search) {

    const start = search.charAt(0);

    for (let i = 0; i < txt.length; i++) {

        if (txt.charAt(i) === start) {

            let found = true;

            for (let j = 1; j < search.length; j++) {

                if (txt.charAt(i + j) !== search.charAt(j)) {

                    found = false;
                    break;
        
                }
      
            }
            if (found) {

                return i;
      
            }
    
        }
  
    }
  
    return -1;

}