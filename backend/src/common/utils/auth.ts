// auth.ts
import jwt from 'jsonwebtoken';
import config from '../../config';

function signToken(payload: any) {
  if (!config.jwtConfig) {
    throw new Error('Missing jwt_Config environment variable');
  }
  return jwt.sign(payload, config.jwtConfig.secret as string, { expiresIn: config.jwtConfig.expiresIn });
}

function verifyToken(token: string) {
  if (!config.jwtConfig) {
    throw new Error('Missing jwt_Config environment variable');
  }

  try {
    const decoded = jwt.verify(token, config.jwtConfig.secret as string);
    return decoded;
  }
  catch (err) {
    throw new Error('Invalid Token');
  }
}

export default {
  signToken,
  verifyToken,
};