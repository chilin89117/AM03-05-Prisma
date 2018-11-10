import jwt from 'jsonwebtoken';

const getToken = userId => jwt.sign({userId}, 'jwttokensecret', {expiresIn: '7d'});

export {getToken as default};
