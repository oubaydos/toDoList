Item.insertMany(items, function(err) {
    if (err)
        console.log(err);
    else console.log("successfully added to DB");
})