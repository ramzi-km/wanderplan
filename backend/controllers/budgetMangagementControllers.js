//------------------ models --------------------//

// import tripModel from '../models/tripModel.js'
import categoryModel from '../models/categoryModel.js'
import expenseModel from '../models/expenseModel.js'

//-----------------------------------------------//

export async function getAllExpenseCategories(req, res) {
    try {
        const categories = await categoryModel.find().lean()
        res.status(200).json({ message: 'success', categories: categories })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function addExpense(req, res) {
    try {
        const { amount, category, description, date, paidBy } = req.body
        const trip = req.trip
        const newExpense = await expenseModel.create({
            amount,
            category,
            description,
            date,
            paidBy,
        })
        if (trip) {
            trip.budget.expenses.push(newExpense._id)
            await trip.save()
            await trip.populate('budget.expenses')
        }
        res.status(201).json({
            message: 'Expense added successfully',
            budget: trip.budget,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
export async function setBudget(req, res) {
    try {
        const { amount } = req.body
        const trip = req.trip
        if (trip) {
            trip.budget.limit = amount
            await trip.save()
            await trip.populate('budget.expenses')
        }
        res.status(201).json({
            message: 'Limit set successfully',
            budget: trip.budget,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
