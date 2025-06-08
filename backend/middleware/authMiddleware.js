const jwt = require('jsonwebtoken');

const verifyAuthentication = (req, res, next) => {
  console.log('Cookies:', req.cookies);

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }

  try {
    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Ensure the decoded token contains the user ID
    if (!decodedToken.userId && !decodedToken.id) {
      return res.status(401).json({
        success: false,
        message: 'Token missing user identification'
      });
    }

    // Standardize the user ID property (support both 'userId' and 'id')
    req.user = {
      id: decodedToken.userId || decodedToken.id,
      email: decodedToken.email,
      role: decodedToken.role
      // Add other necessary user properties
    };

    // Debug logging (remove in production)
    // console.log('Authenticated user:', {
    //   id: req.user.id,
    //   email: req.user.email,
    //   role: req.user.role
    // });

    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token',
      error: error.message // Only include in development
    });
  }
};

module.exports = verifyAuthentication;