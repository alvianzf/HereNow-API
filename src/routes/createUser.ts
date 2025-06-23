import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { asyncHandler } from "../lib/asyncHandler"; 

dotenv.config();

const router = Router();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

router.post("/create-user", asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name, department, position, role } = req.body;

  const { data: userData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !userData?.user?.id) {
    res.status(500).json({ error: authError?.message ?? "User creation failed" });
    return; 
  }

  const userId = userData.user.id;

  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: userId,
    name,
    department,
    position,
    role,
  });

  if (profileError) {
    res.status(500).json({ error: profileError.message });
    return;
  }

  res.status(201).json({ message: "User created", userId });
}));

export default router;
