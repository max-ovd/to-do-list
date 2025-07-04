import items from './data/itemData.js'
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import itemRoutes from './routes/items.js'
import Item from './models/Item.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(bodyParser.json())
const PORT = process.env.PORT || 8000

app.use('/items', itemRoutes);

mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
        /* ADD DATA TO DB */
        // console.log('MongoDB database connection started');
        //  await mongoose.connection.db.dropDatabase();
        // await Item.insertMany(items);
      // await User.insertMany(users);
    })
    .catch((error) => console.log(`Something went wrong: ${error}`))
