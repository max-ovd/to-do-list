import mongoose from 'mongoose'
import { TodoItemSchema } from './TodoItem.js'

export const ListSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        items: [TodoItemSchema],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }, { versionKey: false }
)

const List = mongoose.model("List", ListSchema)
export default List;