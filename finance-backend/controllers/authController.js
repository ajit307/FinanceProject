const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ msg: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters" });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hash, role });

        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        if (error.original?.message?.includes("UNIQUE constraint failed")) {
            return res.status(400).json({ msg: "Email already exists" });
        }
        res.status(500).json({ msg: "Registration failed", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password required" });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "secret123"
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ msg: "Login failed", error: error.message });
    }
};