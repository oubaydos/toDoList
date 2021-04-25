const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.set('view engine', 'ejs');

let items = [];
let workItems = [];
let title = date();

app.get('/', function(req, res) {
    res.render('toDoLists', { Title: title, addedItems: items });
});


app.listen(3000, function() {
    console.log("listening on port 3000");
});

app.post("/", function(req, res) {
    let a = req.body.newItem;
    let b = req.body.submitButton;
    if (b.split(" ")[0] === "Work") {
        workItems.push(a);
        res.redirect("/work");
    } else {
        items.push(req.body.newItem);
        res.redirect("/");
    }

    console.log(items);
});

app.get("/work", function(req, res) {
    res.render("toDoLists", { Title: "Work : " + title, addedItems: workItems });
});

app.get("/contact", function(req, res) {
    res.render("contact");
})