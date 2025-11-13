import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js"; // your Sequelize instance

class ReadingComprehensionExercise extends Model {}
ReadingComprehensionExercise.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.ENUM("A1", "A2", "B1", "B2", "C1", "C2"),
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "ReadingComprehensionExercise",
    tableName: "reading_comprehension_exercises",
    timestamps: true,
  }
);

class Question extends Model {}
Question.init(
  {
    type: {
      type: DataTypes.ENUM(
        "multiple-choice",
        "true-false",
        "fill-in-the-blank",
        "short-answer"
      ),
      allowNull: false,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    answer: {
      type: DataTypes.JSONB, // supports string, array, boolean
      allowNull: false,
    },
    hints: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "Question",
    tableName: "questions",
    timestamps: false,
  }
);

// Associations
ReadingComprehensionExercise.hasMany(Question, {
  foreignKey: "exerciseId",
  as: "questions",
  onDelete: "CASCADE",
});
Question.belongsTo(ReadingComprehensionExercise, { foreignKey: "exerciseId" });

export { ReadingComprehensionExercise, Question };
