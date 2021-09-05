import * as bcrypt from 'bcrypt';

const SALT_OF_ROUNDS = 10;

/**
 * hash 생성 (비밀번호 암호화 등에 사용됨)
 * @param plainText
 */
export const generateHash = async (plainText: string) => {
  return await bcrypt.hash(plainText, SALT_OF_ROUNDS);
};

/**
 * hash validation (비밀번호 검증 등에 사용됨)
 * @param plainText
 * @param hash
 */
export const validateHash = async (plainText: string, hash: string) => {
  return await bcrypt.compare(plainText, hash);
};
