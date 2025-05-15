import items from './data/data.js'
import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import itemRoutes from './routes/items.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(bodyParser.json())
const PORT = process.env.PORT

app.use('/items', itemRoutes);

mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
        //console.log(items)
        //console.log('hi')
        /* ADD DATA TO DB */
      //  await mongoose.connection.db.dropDatabase();
      //  await Item.insertMany(items);
    })
    .catch((error) => console.log(`Something went wrong: ${error}`))
