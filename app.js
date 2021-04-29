const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const app = express();
mongoose.connect("mongodb://localhost:27017/toDoListDB", { useNewUrlParser: true, useUnifiedTopology: true })

const itemsSchema = {
    name: String
};
const listShema = {
    name: String,
    list: [itemsSchema]
};

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("list", listShema);
const item = new Item({
    name: "Welcome :\n to add a new task : click the button +\n to delete a task : click on the check button in the left"
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

app.get("/:customList", function(req, res) {
    const customList = req.params.customList;
    List.findOne({ name: customList + " " + title }, function(err, data) {
        if (!data) {
            const list = new List({
                name: customList + " " + title,
                list: [item]
            });
            list.save();
            console.log("doesnt exist");
            res.redirect("/" + customList);
        } else {
            res.render("toDoLists", { Title: data.name, addedItems: data.list })
        }
    })



});
app.listen(3000, function() {
    console.log("listening on port 3000");
});

app.post("/delete", function(req, res) {
    if (req.body.checkBox.split(" ")[1] == title.split(" ")[0]) {
        console.log(req.body.checkBox + "\n" + req.params);
        Item.deleteOne({ _id: req.body.checkBox.split(" ")[0] }, function(err) {
            if (err) console.log(err);
            else console.log("successfully deleted");
        });
        res.redirect("/");
    } else {
        console.log(req.body.checkBox + "\n" + req.body.checkBox.substr(req.body.checkBox.indexOf(" ") + 1));
        List.findOneAndUpdate({ name: req.body.checkBox.substr(req.body.checkBox.indexOf(" ") + 1) }, { $pull: { list: { _id: req.body.checkBox.split(" ")[0] } } }, function(err, data) {
            if (err)
                console.log(err);
            else {
                console.log("id : " + req.body.checkBox.split(" ")[0] + "\nt7ydat" + "\n" + data);
            }
        });
        res.redirect("/" + req.body.checkBox.split(" ")[1]);
    }



});

app.post("/", function(req, res) {
    let a = req.body.newItem;
    let b = req.body.submitButton;
    console.log(b);
    let temp = new Item({
        name: a
    });
    if (b === title) {
        temp.save();
        res.redirect("/");
    } else {
        List.findOne({ name: b }, function(err, data) {
            data.list.push(temp);
            data.save();
            res.redirect("/" + b.split(" ")[0]);
        })
    }

});


app.get("/contact", function(req, res) {
    res.render("contact");
})