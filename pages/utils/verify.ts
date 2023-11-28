import crypto from "crypto";
import type { NextApiRequest } from "next";
const secretKey = "fD95E5bA64F66A4dDE9A90E4472F3A19";
export function judgeEncryptKeyValid(req: NextApiRequest) {
  const headers = req.headers;
  const body = req.body;
  const nonce = headers["x-base-request-nonce"];
  const timestamp = headers["x-base-request-timestamp"] as string;
  const sig = headers["x-base-signature"];
  // 拼接字符串
  const str = timestamp + nonce + secretKey + JSON.stringify(body);
  // 创建SHA-1加密实例
  const sha1 = crypto.createHash("sha1");
  // 更新要加密的数据
  sha1.update(str);
  // 计算加密结果
  const encryptedStr = sha1.digest("hex");
  // 比较加密结果
  return encryptedStr === sig;
}
