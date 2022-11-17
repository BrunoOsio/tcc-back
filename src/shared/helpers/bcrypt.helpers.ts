import * as bcrypt from "bcrypt";
const SALT_ROUNDS = 10;

export const hash = async (string: string): Promise<string> => {
  const hashed = await bcrypt.hash(string, SALT_ROUNDS);

  return hashed;
}

export const compareValues = async (raw: string, hashed: string): Promise<boolean> => {
  const isEqual = await bcrypt.compare(raw, hashed);
  
  return isEqual
}