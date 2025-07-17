const User = require("../common/models/User");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../common/utils/tokenUtils");

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);    
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();
      res.status(201).json({ message: "User registered", user });
    } catch (err) {
      res.status(500).json({ error: "Registration failed" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

      const { accessToken, refreshToken } = generateTokens(user);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SAMESITE || "Lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === "true",
        sameSite: process.env.COOKIE_SAMESITE || "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

       res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        id : user._id,
      },
      token: accessToken, // or return both tokens if needed
    });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  }

  logout(req, res) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out" });
  }
}

module.exports = new AuthController();
