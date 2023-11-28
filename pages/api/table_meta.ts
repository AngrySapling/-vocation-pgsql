// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
let pool: any;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      let datasourceConfig = JSON.parse(req.body.params).datasourceConfig;
      const { template, tableName } = JSON.parse(datasourceConfig);
      const data = {
        tableName: tableName || "数据表",
        fields: JSON.parse(template),
      };
      // 进行处理，并返回结果
      const result = { code: 0, message: "配置成功", data };
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method not allowed");
  }
}
