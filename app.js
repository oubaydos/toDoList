const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');

const app = express();
mongoose.connect("mongodb://localhost:27017/toDoListDB", { useNewUrlParser: true, useUnifiedTopology: true })

const itemsSchema = {
    name: String
};
/*const listShema = {
    name: String,
    list: [itemsSchema]
};*/

const Item = mongoose.model("Item", itemsSchema);
const WorkItem = mongoose.model("workItem", itemsSchema);
//const List = mongoose.model("list", listShema);
const item = new Item({
    name: "Welcome :\n to add a new task : click the button +\n to delete a task : click on the check button in the left"
});
const workItem = new WorkItem({
    name: item.name
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.set('view engine', 'ejs');



let title = date();




app.get('/', function(req, res) {
    Item.find({}, function(err, results) {
        if (results.length == 0) {
            item.save();
            res.redirect("/");
        } else {
            res.render('toDoLists', { Title: title, addedItems: results });
        }

    });

});

/*app.get("/:customList", function(req, res) {
    const customList = req.params.customList;
    const list = new List({
        name: customList + " " + title,
        items: [item]
    });
    list.save();
});*/
app.listen(3000, function() {
    console.log("listening on port 3000");
});

app.post("/delete", function(req, res) {
    if (req.body.checkBox.split(" ")[1] === "Work") {
        WorkItem.deleteOne({ _id: req.body.checkBox.split(" ")[0] }, function(err) {
            if (err) console.log(err);
            else console.log("successfully deleted");
        });
        res.redirect("/work");

    } else {
        Item.deleteOne({ _id: req.body.checkBox.split(" ")[0] }, function(err) {
            if (err) console.log(err);
            else console.log("successfully deleted");
        });
        res.redirect("/");
    }

});

app.post("/", function(req, res) {
    let a = req.body.newItem;
    let b = req.body.submitButton;
    if (b.split(" ")[0] === "Work") {
        new WorkItem({
            name: a
        }).save();

        res.redirect("/work");
    } else {
        new Item({
            name: a
        }).save();
        res.redirect("/");
    }

});

app.get("/work", function(req, res) {
    WorkItem.find({}, function(err, results) {
        if (results.length == 0) {
            workItem.save();
            res.redirect("/work");
        } else {
            res.render('toDoLists', { Title: "Work " + title, addedItems: results });
        }
    });
});

app.get("/contact", function(req, res) {
    res.render("contact");
})