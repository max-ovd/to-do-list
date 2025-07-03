import express from 'express';
import Item from '../models/Item.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router()


router.get('/', authMiddleware, async (req, res) => {
    console.log("server side get")
    if (req.query.checked) {
        const checked = req.query.checked === 'true';
        const filteredItems = await Item.find({ userId: req.user.id, checked });
        res.json(filteredItems);
    } else {
        const items = await Item.find({ userId: req.user.id })
        res.json(items)
    }
})

router.post('/', authMiddleware, async (req, res) => {
    console.log("server side post")
    try {
        const { _id, item, checked } = req.body
        const userId = req.user.id;

        const itemData = { item, checked, userId }

        if (_id) {
            itemData._id = _id
        }
        const newItem = new Item(itemData)
        await newItem.save()
        res.status(201).json(newItem)
    } catch (e) {
        console.log("Failed to add item: ", e.message)
        return res.status(404).json({ error: 'Something went wrong'})
    }
})

router.get('/:itemId', authMiddleware, async (req, res) => {
    const item = await Item.findOne({ _id: req.params.itemId, userId: req.user.id })
    res.status(200).json(item)

    if (!item) {
        return res.status(404).json({ error: 'Item not found or access denied '})
    }
})

router.patch('/:itemId', authMiddleware, async (req, res) => {
    const id = req.params.itemId
    const updates = req.body
    try {
        const updatedItem = await Item.findOneAndUpdate({_id: id, userId: req.user.id}, {$set: updates}, {new: true})
        res.status(200).json(updatedItem)
    } catch (e) {
        console.log("Failed to update item: ", e.message)
        res.status(404).json("Failed to update item")
    }
})

router.delete('', authMiddleware, async (req, res) => {
    try {
        await Item.deleteMany({userId: req.user.id})
        res.status(200).json({ message: "All items successfully deleted "})
    } catch (e) {
        console.log("Failed to delete all messages: ", e.message)
        res.status(404).json("Failed to delete items")
    }
})

router.delete('/:itemId', authMiddleware, async (req, res) => {
    const id = req.params.itemId
    const deletedItem = await Item.findById(id);
    try {
        await Item.deleteOne({_id: id, userId: req.user.id})
        console.log(deletedItem)
        res.status(200).json(deletedItem)
    } catch (e) {
        console.log("Failed to delete message: ", e.message)
    }
})

export default router;