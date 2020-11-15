// Event Model

// Dependencies
// use Model and Datatype from sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

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
        calendarId: {
            type: DataTypes.STRING,
            allowNull:false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        start:{
            type: DataTypes.STRING,
            allowNull: false
        },
        end:{
            type: DataTypes.STRING,
            allowNull: false
        },
        isAllDay: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            len: [1]
        },
        category:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'time',
            validate: {
                isIn: {
                    args: [['milestone', 'task', 'allday', 'time']],
                    msg: 'category must be milestone, task, allday or time',
                },
            }
        },
        location:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Home'
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            len: [1,2]
        },
        isReadOnly: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Black'
        },
        bgColor: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Green'
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'busy',
            validate: {
                isIn: {
                    args: [['busy','free']],
                    msg: 'Must be busy or free',
                }
            }
        }
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'event'
    }
);

module.exports = Event;