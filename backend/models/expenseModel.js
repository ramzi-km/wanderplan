/* eslint-disable no-unused-vars */
import { Schema, model } from 'mongoose'

const expenseSchema = new Schema({
    amount: Number,
    category: { type: Schema.Types.ObjectId, ref: 'Category' }, // Reference to the Category model
    description: String,
    date: Date,
    paidBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
})

const Expense = model('Expense', expenseSchema)

export default Expense
