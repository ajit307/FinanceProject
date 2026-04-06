const Record = require("../models/Record");

const validateRecord = (body) => {
    const { amount, type, category, date } = body;
    if (!amount || !type || !category || !date) {
        return { valid: false, msg: "Missing required fields" };
    }
    if (isNaN(amount) || amount <= 0) {
        return { valid: false, msg: "Amount must be a positive number" };
    }
    if (!["income", "expense"].includes(type)) {
        return { valid: false, msg: "Type must be 'income' or 'expense'" };
    }
    return { valid: true };
};

exports.createRecord = async (req, res) => {
    try {
        const validation = validateRecord(req.body);
        if (!validation.valid) {
            return res.status(400).json({ msg: validation.msg });
        }

        const record = await Record.create({
            ...req.body,
            UserId: req.user.id
        });
        res.json(record);
    } catch (error) {
        res.status(500).json({ msg: "Failed to create record", error: error.message });
    }
};

exports.getRecords = async (req, res) => {
    try {
        const { type, category } = req.query;

        const filter = { UserId: req.user.id };
        if (type) filter.type = type;
        if (category) filter.category = category;

        const records = await Record.findAll({ where: filter });
        res.json(records);
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch records", error: error.message });
    }
};

exports.updateRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Record.findOne({ where: { id } });

        if (!record) {
            return res.status(404).json({ msg: "Record not found" });
        }

        if (record.UserId !== req.user.id) {
            return res.status(403).json({ msg: "Not authorized to update this record" });
        }

        const validation = validateRecord(req.body);
        if (!validation.valid) {
            return res.status(400).json({ msg: validation.msg });
        }

        await Record.update(req.body, { where: { id } });
        res.json({ msg: "Updated" });
    } catch (error) {
        res.status(500).json({ msg: "Failed to update record", error: error.message });
    }
};

exports.deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await Record.findOne({ where: { id } });

        if (!record) {
            return res.status(404).json({ msg: "Record not found" });
        }

        if (record.UserId !== req.user.id) {
            return res.status(403).json({ msg: "Not authorized to delete this record" });
        }

        await Record.destroy({ where: { id } });
        res.json({ msg: "Deleted" });
    } catch (error) {
        res.status(500).json({ msg: "Failed to delete record", error: error.message });
    }
};