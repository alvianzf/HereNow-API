// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabaseClient";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.token; // Ambil token dari cookie

  if (!token) {
    res.status(401).json({ error: "Unauthorized. No token provided." });
    return;
  }

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user?.user) {
    res.status(401).json({ error: "Unauthorized. Invalid token." });
    return;
  }

  (req as any).user = user.user;
  next();
};
