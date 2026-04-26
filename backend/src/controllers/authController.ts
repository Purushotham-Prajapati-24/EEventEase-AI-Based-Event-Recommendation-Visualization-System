import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, interests } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      interests,
    });

    if (user) {
      const accessToken = generateAccessToken(String(user._id));
      const refreshToken = generateRefreshToken(String(user._id));
      setRefreshTokenCookie(res, refreshToken);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
        token: accessToken,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const accessToken = generateAccessToken(String(user._id));
      const refreshToken = generateRefreshToken(String(user._id));
      setRefreshTokenCookie(res, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
        token: accessToken,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ message: "Invalid refresh token" });

    const accessToken = generateAccessToken(String(user._id));
    res.json({ token: accessToken });
  } catch (error) {
    res.status(401).json({ message: "Token refresh failed", error });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out" });
};
