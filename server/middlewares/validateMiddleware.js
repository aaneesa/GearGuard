export const validateUser = (req, res, next) => {
  const { name, password } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name cannot be empty or whitespace" });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      error: "Password must be at least 8 characters, have a lowercase letter, and a special character" 
    });
  }

  next();
}
