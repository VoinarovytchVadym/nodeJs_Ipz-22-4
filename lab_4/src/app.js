const express = require("express")
const mongoose = require("mongoose")
const userRouter = require("../routers/user")
const taskRouter = require("../routers/task")
require("dotenv").config()


const PORT = process.env.PORT
const URL = process.env.MONGO_URL
const app = express()
app.use(express.json()) //body-parser
app.use("/users", userRouter)
app.use("/tasks", taskRouter)


async function startServer() {
    try {
        await mongoose.connect(URL)
        app.listen(PORT, () => {
            console.log(`Server is listening on ${PORT}`)
        })
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message)
    }
}



startServer();



