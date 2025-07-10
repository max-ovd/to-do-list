import express from 'express';
import TodoItem from '../models/TodoItem.js';
import List from '../models/List.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import mongoose from 'mongoose';
import { validateAddItem, validateAddList } from '../validator.js';
    

const router = express.Router()


router.get('/', authMiddleware, async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await User.findOne({ "userId": userId });

        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        return res.status(200).json({ user });
    } catch (e) {
        console.log("error: ", e.message);
        return res.status(500).json({ message: "Something went wrong" })
    }
})

router.post('/init-account', authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const newUser = new User ({ "userId": userId, lists: [] });
        const listTitle = "To Do List";

        newUser.lists.push({
            "title": listTitle,
            "items": []
        })

        await newUser.save();
        res.status(201).json({ message: "Account initialized successfully", user: newUser})

    } catch (e) {
        console.log("Error initializing account: ", e.message);
        return res.status(500).json({ message: "Something went wrong" });
    }
})

router.post('/add-item', authMiddleware, async (req, res) => {
    const { _id, title, checked, parent } = req.body;
    const userId = req.user.id;

    console.log("server: adding item");

    try {
        const { error } = validateAddItem(req.body);

        if (error) {
            console.log("Error with joi backend", error);
            return res.status(400).json({ message: "Bad request" });
        }

        // find user
        const user = await User.findOne({ "userId": userId }); 

        // create new item
        const newItem = new TodoItem ({ "title": title, "checked": checked });

        if (_id) {
            newItem._id = new mongoose.Types.ObjectId(_id);
        }
        const targetList = user.lists.find(list => list.title === parent);

        targetList.items.push(newItem);

        await user.save();
        res.status(201).json({ message: "Added item successfully", newUser: user, newItem: newItem });

    } catch (e) {
        console.log("Error posting new item: ", e.message);
        return res.status(500).json({ message: "Something went wrong" });
    }
})

router.post('/add-list', authMiddleware, async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;

    try {
        const { error } = validateAddList(req.body);

        if (error) {
            return res.status(400).json({ message: "Bad request" });
        }

        const user = await User.findOne({ "userId": userId });
        const newList = new List ({title: title, items: []});
        
        user.lists.push(newList);

        await user.save();
        res.status(200).json({ message: "List added successfully", newUser: user, newList: newList});

    } catch (e) {
        res.status(500).json({ message: `Error creating a new list: ${e.message}` }); 
    }

})

router.post('/delete/:selectedListTitle/:itemId', authMiddleware, async (req, res) => {
    const itemId = req.params.itemId;
    const parent = req.params.selectedListTitle;
    const userId = req.user.id;

    try {
        const user = await User.findOne({ "userId": userId });
        const path = user.lists.find(list => list.title === parent);

        let initialItemCount = path.items.length;
        const deletedItem = path.items.find(item => item._id.toString() === itemId);
        path.items = path.items.filter(item => item._id.toString() !== itemId);

        if (initialItemCount === path.items.length) {
            console.warn('Delete Warning: Item to be deleted was not found');
            return res.status(404).json({ message: "Item to be deleted was not found" })
        }

        await user.save();
        res.status(202).json({ message: "Deleted Item Successfully", deletedItem: deletedItem, newUser: user });
    } catch (e) {
        console.error("error deleting", e.message);
        return res.status(500).json({ message: "Something went wrong" });
    }
})

router.delete('/all/:selectedListTitle', authMiddleware, async (req, res) => {
    const { selectedListTitle } = req.params;
    const userId = req.user.id;

    try {
        const user = await User.findOne({ "userId": userId });
        const path = user.lists.find(list => list.title === selectedListTitle);

        path.items = [];
        await user.save();

        res.status(200).json({ message: "Successfully deleted all items", newUser: user })
    } catch (e) {
        console.error("There was an error clearing the items: ", e.message);
        return res.status(500).json({ message: "Something went wrong" });
    }
})

router.patch('/editTask/:itemId', authMiddleware, async (req, res) => {
    const { itemId } = req.params;
    const { title, checked, parent } = req.body;
    const userId = req.user.id;

    try {
        const { error } = validateAddItem(req.body);

        if (error) {
            return res.status(400).json({ message: "Bad request" });
        }

        const user = await User.findOne({ "userId": userId });        
        const path = user.lists.find(list => list.title === parent);

        if (!path) {
            console.warn("router.patch - the path is undefined");
        }
        const updatedItem = new TodoItem ({
            title: title,
            checked: checked
        })

        const item = path.items.id(itemId)

        if (!item) {
            console.warn("router.patch - item does not exist");
            return null;
        }

        item.title = title;
        item.checked = checked;

        await user.save();

        console.log("Item updated successfully");
        res.status(200).json({ message: "Successfully saved edit", updatedItem: updatedItem, newUser: user })
    } catch (e) {
        console.error("There was an error editing the item: ", e.message);
        return res.status(500).json({ message: "Something went wrong" });
    }
})

export default router;