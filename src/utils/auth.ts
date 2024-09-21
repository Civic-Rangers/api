import jwt from "jsonwebtoken";
interface IJwtData {
  _id: string;
}

export const createJwt = (data: IJwtData): string => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "1h" });
};
