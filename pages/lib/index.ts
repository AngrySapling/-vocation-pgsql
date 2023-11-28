import { Client } from "pg";
const client = new Client();
interface IOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}
export async function getConnection(Options: IOptions) {
  const pool = new Client(Options);
  await pool.connect();
  return pool;
}
