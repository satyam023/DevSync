const validateUpdateProfile = (req, res, next) => {
  const { name, skills, role, rates, paymentDetails, bio, gender } = req.body;

  if (name && typeof name !== 'string') {
    return res.status(400).json({ message: 'Name must be a string' });
  }

  if (skills && !Array.isArray(skills)) {
    return res.status(400).json({ message: 'Skills must be an array' });
  }

  if (role && !['mentor', 'learner', 'recruiter', 'developer'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  if (rates) {
    if (typeof rates !== 'object') return res.status(400).json({ message: 'Rates must be an object' });
    if (rates.mentor !== undefined && typeof rates.mentor !== 'number') {
      return res.status(400).json({ message: 'Mentor rate must be a number' });
    }
    if (rates.developer !== undefined && typeof rates.developer !== 'number') {
      return res.status(400).json({ message: 'Developer rate must be a number' });
    }
  }

  if (paymentDetails && typeof paymentDetails !== 'object') {
    return res.status(400).json({ message: 'Payment details must be an object' });
  }

  if (bio && typeof bio !== 'string') {
    return res.status(400).json({ message: 'Bio must be a string' });
  }

  if (gender && !['male', 'female', 'other'].includes(gender.toLowerCase())) {
    return res.status(400).json({ message: 'Gender must be male, female, or other' });
  }

  next();
};

module.exports = validateUpdateProfile;
