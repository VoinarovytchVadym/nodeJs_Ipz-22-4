const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed : {
        type: Boolean,
        required: false,
        default: false
    }
})

const Task = mongoose.model("Task", taskSchema)
module.exports = Task