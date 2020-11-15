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
            type: DataTypes.INTEGER,
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
        isAllDay: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            len: [1],
            defaultValue: false
        },
        start:{
            type: DataTypes.STRING,
            allowNull: false
        },
        end:{
            type: DataTypes.STRING,
            allowNull: false
        },
        goingDuration:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30,
            validate: {
                len: [1]
            }
        },
        comingDuration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30,
            validate: {
                len: [1]
            }
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "#ffffff",
            validate: {
                len: [3]
            }
        },
        isVisible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        bgColor:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "#69BB2D",
            validate: {
                len: [3]
            }
        },
        dragBgColor:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "#69BB2D",
            validate: {
                len: [3]
            }
        },
        borderColor:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "#69BB2D",
            validate: {
                len: [3]
            }
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
        dueDateClass: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        customStyle:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "cursor: default;"
        },
        isPending:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        isFocused:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        isReadOnly:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        isPrivate:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        location:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Home'
        },
        attendees:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
        },
        recurrenceRule:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ""
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