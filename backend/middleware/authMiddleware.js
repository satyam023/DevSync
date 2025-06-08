const jwt = require('jsonwebtoken');

const verifyAuthentication = (req, res, next) => {
  console.log('Cookies:', req.cookies);

 const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY); 
    if (!decodedToken.userId && !decodedToken.id) {
      return res.status(401).json({
        success: false,
        message: 'Token missing user identification'
      });
    }
     req.user = {
      id: decodedToken.userId || decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role
    };
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token',
      error: error.message 
    });
  }
};

module.exports = verifyAuthentication;