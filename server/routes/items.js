import express from 'express';
import Item from '../models/Item.js';

const router = express.Router()


router.get('/', async (req, res) => {
    if (req.query.checked) {
        const checked = req.query.checked === 'true';
        const filteredItems = await Item.find({ checked });
        res.json(filteredItems);
    } else {
        const items = await Item.find()
        res.json(items)
    }
})

router.post('/', async (req, res) => {
    try {
        const { _id, item, checked } = req.body

        const itemData = { item, checked }

        if (_id) {
            itemData._id = _id
        }
        const newItem = new Item(itemData)
        await newItem.save()
        res.status(201).json(newItem)
    } catch (e) {
        console.log("Failed to add item: ", e.message)
    }
})

router.get('/:itemId', async (req, res) => {
    const item = await Item.findById(req.params.itemId)
    res.status(200).json(item)
})

router.patch('/:itemId', async (req, res) => {
    const id = req.params.itemId
    const updates = req.body
    try {
        const updatedItem = await Item.findOneAndUpdate({_id: id}, {$set: updates}, {new: true})
        res.status(200).json(updatedItem)
    } catch (e) {
        console.log("Failed to update item: ", e.message)
    }
})

router.delete('', async (req, res) => {
    try {
        await Item.deleteMany({})
        res.status(200).json({ message: "All items successfully deleted "})
    } catch (e) {
        console.log("Failed to delete all messages: ", e.message)
    }
})

router.delete('/:itemId', async (req, res) => {
    const id = req.params.itemId
    const deletedItem = await Item.findById(id);
    try {
        await Item.deleteOne({_id: id})
        console.log(deletedItem)
        res.status(200).json(deletedItem)
    } catch (e) {
        console.log("Failed to delete message: ", e.message)
    }
})

export default router;