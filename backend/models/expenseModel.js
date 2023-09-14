/* eslint-disable no-unused-vars */
import { Schema, model } from 'mongoose'

const expenseSchema = new Schema({
    amount: Number,
    category: Object,
    description: String,
    date: Date,
    paidBy: Object,
})

const Expense = model('Expense', expenseSchema)

export default Expense
