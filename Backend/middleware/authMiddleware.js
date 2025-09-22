const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YdQF9DgD9s5QLXSzrLBGDbs1tb1AMncCatoCNiTi5Q18MKokF3jLBxlEi-28uPC1');
    req.userId = decoded.id; // Important!
    next();
  } catch (err) {
    console.error('❌ Invalid token:', err);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
