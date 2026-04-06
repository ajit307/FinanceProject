const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Record = sequelize.define("Record", {
    amount: DataTypes.FLOAT,
    type: DataTypes.ENUM("income", "expense"),
    category: DataTypes.STRING,
    date: DataTypes.DATE,
    notes: DataTypes.STRING
});

User.hasMany(Record);
Record.belongsTo(User);

module.exports = Record;
