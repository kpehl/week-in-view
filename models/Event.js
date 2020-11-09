// Event Model

// Dependencies
// use Model and Datatype from sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// use bcrypt for password hashing
const bcrypt = require('bcrypt');

// Create the event model
class Event extends Model {}

// Define the table columns and configuration
Event.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                nonEmpty: true
            }
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        year:{
            type: DataTypes.INTEGER,
            allowNull: false,
            len: [4]
        },
        month:{
            type: DataTypes.INTEGER,
            allowNull: false,
            len: [1]
        },
        day: {
            type: DataTypes.INTEGER,
            allowNull: false,
            len: [1]
        },
        hour:{
            type: DataTypes.INTEGER,
            allowNull: false,
            len: [1,2]
        },
        minute:{
            type: DataTypes.INTEGER,
            allowNull: false,
            len: [4]
        }
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'vote'
    }
)

module.exports = Event;