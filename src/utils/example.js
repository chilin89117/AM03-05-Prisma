const getFirst = name => name.split(' ')[0];
const isPwdValid = pwd => pwd.length >= 8 && !pwd.toLowerCase().includes('password');

export {getFirst, isPwdValid};
