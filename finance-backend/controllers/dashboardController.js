const Record = require("../models/Record");

exports.summary = async (req, res) => {
    try {
        const records = await Record.findAll({ where: { UserId: req.user.id } });

        let income = 0, expense = 0;

        records.forEach(r => {
            if (r.type === "income") income += r.amount;
            else expense += r.amount;
        });

        res.json({
            totalIncome: income,
            totalExpense: expense,
            netBalance: income - expense
        });
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch summary", error: error.message });
    }
};