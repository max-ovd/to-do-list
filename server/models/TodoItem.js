import mongoose from 'mongoose'

export const TodoItemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        checked: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }, { versionKey: false }
)

const TodoItem = mongoose.model("TodoItem", TodoItemSchema)
export default TodoItem;