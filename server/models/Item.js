import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema(
    {
        item: String,
        checked: Boolean,
        id: String
    }, { versionKey: false }
)

const Item = mongoose.model("Item", ItemSchema)
export default Item;