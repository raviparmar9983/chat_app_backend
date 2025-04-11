import * as bcrypt from 'bcryptjs';

export const hashGenerator = async (data: string) => {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(data, salt);
  return hash;
};

export const compareHash = async (hash: string, password: string) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
