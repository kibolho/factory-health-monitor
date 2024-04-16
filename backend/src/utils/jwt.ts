import jwt from 'jsonwebtoken';

export const generateAccessToken = (user: { id: string; }) => {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '5m',
  });
}

export const generateRefreshToken = (user: { id: string; }, jti: any) => {
  return jwt.sign({
    userId: user.id,
    jti
  }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: '8h',
  });
}

export const generateTokens = (user: { id: string; }, jti: any)=>{
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, jti);

  return {
    accessToken,
    refreshToken,
  };
}