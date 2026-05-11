import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, horizon, propertyTitle, propertySlug, locale } = body;

    // Guardar en Supabase tabla leads
    await supabase.from("leads").insert({
      name, email, phone, horizon,
      property_title: propertyTitle,
      property_slug: propertySlug,
      locale,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
