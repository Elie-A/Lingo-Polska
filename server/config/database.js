// config/database.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
// dotenv.config({ path: path.resolve("server/.env") });

const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database user
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  }
);

export default sequelize;
