/* eslint-disable no-unused-vars */
import { Schema, model } from 'mongoose'

const expenseSchema = new Schema({
    amount: Number,
    category: { type: Schema.Types.ObjectId, ref: 'Category' }, 
    description: String,
    date: Date,
    paidBy: { type: Schema.Types.ObjectId, ref: 'User' },
})

const Expense = model('Expense', expenseSchema)

export default Expense
