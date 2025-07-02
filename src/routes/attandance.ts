import express from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { supabase } from "../lib/supabaseClient";

const router = express.Router();

const MAX_RADIUS = 50;

function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

router.post(
  "/clock-in",
  asyncHandler(async (req, res) => {
    const { userId, latitude, longitude } = req.body;

    const { data: office, error: officeError } = await supabase
      .from("office_locations")
      .select("latitude, longitude")
      .limit(1)
      .single();

    if (officeError || !office) {
      res.status(500).json({ error: "Gagal ambil lokasi kantor" });
      return;
    }

    const distance = getDistance(
      latitude,
      longitude,
      office.latitude,
      office.longitude
    );
    if (distance > MAX_RADIUS) {
      res.status(403).json({
        error: `Lokasi terlalu jauh (${distance.toFixed(1)}m). Maksimal 50m.`,
      });
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const { data: existing, error: checkError } = await supabase
      .from("attendance_records")
      .select("id")
      .eq("user_id", userId)
      .gte("clock_in", `${today}T00:00:00`)
      .lte("clock_in", `${today}T23:59:59`);

    if (checkError) {
      res.status(500).json({ error: checkError.message });
      return;
    }

    if (existing && existing.length > 0) {
      res.status(400).json({ error: "Sudah clock-in hari ini." });
      return;
    }

    const { error: insertError } = await supabase
      .from("attendance_records")
      .insert([
        {
          user_id: userId,
          latitude,
          longitude,
          clock_in: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      res.status(500).json({ error: insertError.message });
      return;
    }

    res.json({ message: "Clock-in berhasil", distance: distance.toFixed(2) });
  })
);

router.post(
  "/clock-out",
  asyncHandler(async (req, res) => {
    const { userId } = req.body;

    const today = new Date().toISOString().slice(0, 10);

    const { data: record, error: fetchError } = await supabase
      .from("attendance_records")
      .select("*")
      .eq("user_id", userId)
      .gte("clock_in", `${today}T00:00:00`)
      .lte("clock_in", `${today}T23:59:59`)
      .is("clock_out", null)
      .limit(1)
      .single();

    if (fetchError || !record) {
      res.status(404).json({ error: "Belum clock-in atau sudah clock-out." });
      return;
    }

    const { error: updateError } = await supabase
      .from("attendance_records")
      .update({ clock_out: new Date().toISOString() })
      .eq("id", record.id);

    if (updateError) {
      res.status(500).json({ error: updateError.message });
      return;
    }

    res.json({ message: "Clock-out berhasil" });
  })
);

export default router;
