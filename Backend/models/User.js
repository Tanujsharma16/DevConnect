const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
    type: Number,
    min: 18,
    max: 100
},

gender: {
    type: String,
    enum: ["male", "female", "other"]
},

photoUrl: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
},

about: {
    type: String,
    default: "Hey there! I am using DevConnect.",
    maxlength: 500,
    trim: true
},

skills: {
    type: [String],
    default: []
}
});


const User = mongoose.model("User", userSchema);

module.exports = User;