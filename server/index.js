import items from './data/data.js'
import Item from './models/Item.js'
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()
dotenv.config()
app.use(cors())
const PORT = process.env.PORT

app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
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


// TODO!!
// set up routes and then connect front end to back end