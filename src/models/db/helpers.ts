/*!
 * By:
 * Martin Borg
 */

import { hash, compare } from 'bcrypt';

export const generatePass = async(pass: string, nrOfSalt: number = 10): Promise<any> => {
  try {
    const encrypted = await hash(pass, nrOfSalt);
    return encrypted;
  } catch {
    return false;
  }
};

export const comparePass = async(hash: string, pass: string): Promise<any> => {
  try {
    const compared = await compare(hash, pass);
    return compared;
  } catch {
    return false;
  }
};
