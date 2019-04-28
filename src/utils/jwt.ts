import { verify } from 'jsonwebtoken';

export const getUser = (token: string) => {
  try {
    // @ts-ignore
    const { data } = verify(token, 'secret');

    return data;
  } catch (e) {
    return null;
  }
};
