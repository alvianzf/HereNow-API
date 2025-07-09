// src/routes/auth.ts
import express from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { supabase } from "../lib/supabaseClient";

const router = express.Router();

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const { user } = data;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      res.status(500).json({ error: "Failed to fetch profile" });
      return;
    }

    res
      .cookie("token", data.session.access_token, {
        httpOnly: true,
        secure: false, // ganti true jika pakai HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 hari
      })
      .status(200)
      .json({
        id: user.id,
        email: user.email,
        name: profile?.name ?? "",
        role: profile?.role ?? "employee",
        department: profile?.department ?? "",
        position: profile?.position ?? "",
      });
  })
);

export default router;
