import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Vocabulary = sequelize.define(
  "Vocabulary",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    polish: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    english: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["A1", "A2", "B1", "B2", "C1", "C2"]],
      },
    },
  },
  {
    tableName: "vocabulary",
    timestamps: true,
    indexes: [
      { fields: ["category"] },
      { fields: ["level"] },
      { fields: ["polish", "english"] },
      { unique: true, fields: ["polish", "english", "category", "level"] },
    ],
  }
);

export default Vocabulary;
