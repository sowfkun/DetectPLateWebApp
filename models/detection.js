var mongoose = require("mongoose");


var detectionSchema = new mongoose.Schema({
    drink_id: {
      type: String,
      required: [true, 'drink_id is required']
    },
    category_id: {
      type: String,
      required: [true, 'category_id is required']
    },
    name: { 
        type: String, 
        required: [true, 'name is required']
    },
    price: { 
        type: Object, 
        required: [true, 'name is required'],
        properties:{
            size_m:{
                type: Number
            },
            size_l:{
                type: Number,
                required: [true, 'name is required']
            } 
        }
    }, 
    status: { 
        type: String,
        enum: [ "active", "inactive" ]
    },
    img: {
        type: String,
        require:  [true, 'img is required']
    },
    topping: {
        type: Boolean,
        require: [true, 'topping is required']
    }
  });
var Drink = mongoose.model("Drink", drinkSchema, "drink");

module.exports = Drink;
