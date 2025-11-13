// models/Exercise.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Exercise = sequelize.define(
  "Exercise",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM("A1", "A2", "B1", "B2", "C1", "C2"),
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.TEXT), // array of strings
      defaultValue: [],
    },
    hints: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
    },
    text: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "exercises",
    timestamps: true,
    indexes: [
      { fields: ["topic"] },
      { fields: ["type"] },
      { fields: ["level"] },
      { fields: ["topic", "level"] },
      { fields: ["topic", "type"] },
      { fields: ["topic", "level", "type"] },
      { fields: ["createdAt"], order: [["createdAt", "DESC"]] },
    ],
  }
);

export default Exercise;
