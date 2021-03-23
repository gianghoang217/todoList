const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://giang-admin:Test123@cluster0-shard-00-00.kn9yc.mongodb.net:27017,cluster0-shard-00-01.kn9yc.mongodb.net:27017,cluster0-shard-00-02.kn9yc.mongodb.net:27017/todolistDB?ssl=true&replicaSet=atlas-fwmoo2-shard-0&authSource=admin&retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
// thành công
.then( () => console.log('Kết nối DB thành công') )
// thất bại, báo lỗi
.catch( (err) => console.log(err) );;

const todoSchema = {
  name: String
};

const Item = mongoose.model("Item", todoSchema);

//Item will turn into items table, sort of
const item1 = new Item({
  name: "Welcome to your todolist"
});


const defaultItems = [item1];
const listSchema = {
  name: String,
  items: [todoSchema]
};

const List = mongoose.model("List", listSchema);

let workItems = [];

app.get("/", function(req, res) {
  // let day = date.getDate();
  Item.find({}, function(err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            ("Successfully saved default items to DB");
          }
        });
        res.render("/");
      } else {
        res.render("list", {
          listTitle: "Today",
          newListItems: foundItems
        });
      }
    }
  });
});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });
});


app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
    });
    res.redirect("/" + listName);
  }

});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        console.log("Successfully delete checked item");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function(err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("server is running on port");
});
