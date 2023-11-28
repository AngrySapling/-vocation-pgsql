// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { judgeEncryptKeyValid } from "../utils/verify";
import { getConnection } from "../lib/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = req.body;
    if (!judgeEncryptKeyValid(req)) {
      res.status(401).json({
        message: "请求无效",
      });
      return;
    }
    const datasourceConfig = JSON.parse(body.params).datasourceConfig;
    const { value, sql } = JSON.parse(datasourceConfig);
    let client;
    try {
      client = await getConnection(value);
      const { rows } = await client.query(`${sql}`);
      const result = {
        nextPageToken: "",
        hasMore: false,
        records: rows.map((res, index) => {
          return {
            primaryId: "record_" + (index + 1),
            data: res,
          };
        }),
      };
      res.status(200).json({
        code: 0,
        message: "",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    } finally {
      client && client.end();
    }
  } else {
    // Handle any other HTTP method
  }
}
