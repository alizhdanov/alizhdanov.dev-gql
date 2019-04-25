import { verify } from 'jsonwebtoken';

export const validateToken = (token: string): boolean => {
  try {
    return !!verify(token, 'secret');
  } catch (e) {
    return false;
  }
};
