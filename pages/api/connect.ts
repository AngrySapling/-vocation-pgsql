// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getConnection } from "../lib/index";
type Data = {
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method not allowed");
    return;
  }
  let client;
  try {
    client = await getConnection(req.body);
    res.status(200).json({ message: "success" });
  } catch (error: any) {
    res.status(500).json({ message: error });
  } finally {
    client && client.end();
  }
}
