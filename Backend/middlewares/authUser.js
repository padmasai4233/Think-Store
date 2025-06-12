import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You must be logged in to access this resource",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.SECRET_KEY);

    if (tokenDecode.id) {
      req.userId = tokenDecode.id; // ✅ Store on `req`, not `req.body`
    } else {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export default authUser;
