import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

const connect = postgres({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
});

export default connect;
