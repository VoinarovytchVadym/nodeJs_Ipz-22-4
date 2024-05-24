const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        validate: {
            validator: function(value) {
                return validator.isEmail(value);
            },
            message: "Invalid email format"
        },
        required:true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate: {
            validator: function(value) {
                return !value.toLowerCase().includes('password');
            },
            message: 'Password should not contain the word "password"'
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.pre('save', async function(next) {
    try {
        // Перевірка наявності помилок валідації
        const errors = this.validateSync();
        if (errors) {
            const errorMessages = Object.values(errors.errors).map(error => error.message);
            throw new Error(errorMessages.join(', '));
        }

        if (this.isModified('password')) {
            const saltRounds = 10;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.statics.findOneByCredentials = async function(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Incorrect email');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    return user;
};
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, 'gdfjghkjdfhgfds');
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

const User = mongoose.model("User", userSchema)

module.exports = User
