import items from './data/data.js'
import Item from './models/Item.js'
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'

const app = express()
dotenv.config()
app.use(cors())
app.use(bodyParser.json())
const PORT = process.env.PORT

app.get('/items', async (req, res) => {
    if (req.query.checked) {
        const checked = req.query.checked === 'true';
        const filteredItems = items.filter(item => item.checked === checked);
        console.log(filteredItems)
        res.json(filteredItems);
    } else {
        const items = await Item.find()
        res.json(items)
    }
})

app.post('/items', async (req, res) => {
    try {
        const receivedData = req.body
        const { item, checked } = receivedData
        const newItem = new Item({ item, checked })
        await newItem.save()
        res.status(201).json(newItem)
    } catch (e) {
        console.log("Failed to add item: ", e.message)
    }
})

app.get('/items/:userId', async (req, res) => {
    const item = await Item.findById(req.params.userId)
    res.status(200).json(item)
})

app.patch('/items/:userId', async (req, res) => {
    const id = req.params.userId
    const updates = req.body
    try {
        const updatedItem = await Item.findOneAndUpdate({_id: id}, {$set: updates}, {new: true})
        res.status(200).json(updatedItem)
    } catch (e) {
        console.log("Failed to update item: ", e.message)
    }
})

app.delete('/items', async (req, res) => {
    try {
        await Item.deleteMany({})
        res.status(200).json({ message: "All items successfully deleted "})
    } catch (e) {
        console.log("Failed to delete all messages: ", e.message)
    }
})

app.delete('/items/:userId', async (req, res) => {
    const id = req.params.userId
    try {
        await Item.deleteOne({_id: id})
        res.status(200).json({ message: "All items successfully deleted "})
    } catch (e) {
        console.log("Failed to delete all messages: ", e.message)
    }
})


mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
        console.log(items)

        /* ADD DATA TO DB */
      //  await mongoose.connection.db.dropDatabase();
      //  await Item.insertMany(items);
    })
    .catch((error) => console.log(`Something went wrong: ${error}`))
