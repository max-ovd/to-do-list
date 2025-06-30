import express from 'express'
import User from '../models/User.js';

const router = express.Router();


router.post('/', async (req, res) => {
    const user = req.body;
    const { email, password } = user;
    console.log(email);
    console.log(password);
    res.json(user);
})


export default router;