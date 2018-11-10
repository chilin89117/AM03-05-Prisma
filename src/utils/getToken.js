import jwt from 'jsonwebtoken';

const getToken = userId => jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'});

export {getToken as default};
