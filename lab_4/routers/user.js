const express = require("express")
const User = require("./../models/user")
const auth = require("./../src/middleware/auth")
const router = new express.Router()

router.post("/", async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        res.json(user)
    } catch (error) {
        res.send(error.message)
    }
})

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id})
        if (!user) {
            res.status(404)
            throw new Error("User not found")
        }
        res.json(user)
    } catch (error) {
        res.send(error.message)
    }
})

router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.send(error.message)
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id})
        if (!user) {
            res.status(404)
            throw new Error("User not found");
        }
        const fields = ["name", "age", "email", "password"]
        fields.forEach((field) => {
            if (req.body[field]) {
                user[field] = req.body[field];
            }
        })
        await user.save();
        res.json(user)
    } catch (error) {
        res.send(error.message)
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findOneAndDelete({_id: req.params.id})
        if (!user) {
            res.status(404)
            throw new Error("User not found")
        }
        res.json(user)
    } catch (error) {
        res.send(error.message)
    }
})

router.delete("/", async (req, res) => {
    try {
        const result = await User.deleteMany()
        res.json(result)
    } catch (error) {
        res.send(error.message)
    }
})

router.post("/login", async (req, res) => {
    try {
        const user = await  User.findOneByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send()
    }
});

router.get('/me', auth, async (req, res) => {
    res.send(req.user);
})

router.post("/logout", auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
