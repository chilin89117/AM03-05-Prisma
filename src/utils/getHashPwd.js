import bcrypt from 'bcryptjs';

const getHashPwd = pwd => {
  if(pwd.length < 6) throw new Error('Password length must be at least 6.');
  return bcrypt.hash(pwd, 10);
}

export {getHashPwd as default};
