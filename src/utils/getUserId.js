import jwt from 'jsonwebtoken';

const getUserId = (req, requireAuth=true) => {
  // header depends on whether it's http from request or websocket subscription
  const header = req.request ? req.request.headers.authorization : req.connection.context.Authorization;
  // If header is provided, return user's id
  if(header) {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, 'jwttokensecret');
    return decoded.userId;    
  }
  // If no header is provided but authentication is required, throw error
  if(requireAuth) throw new Error('Authentication required.');
  // If no header is provided and authentication is not required, return null
  return null;
}

export {getUserId as default};
