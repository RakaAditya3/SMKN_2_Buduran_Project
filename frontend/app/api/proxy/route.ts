import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
  }

  try {
    // ✅ Fetch dari backend Laravel
    const res = await fetch(imageUrl, {
      headers: {
        Accept: "image/*",
      },
      cache: "no-store",
    });

    // ❌ Kalau gagal ambil (404, 403, dsb)
    if (!res.ok) {
      console.warn(`❌ Proxy failed for ${imageUrl}: ${res.status} ${res.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    // ✅ Ambil data binary (gambar)
    const arrayBuffer = await res.arrayBuffer();

    // ✅ Buat response dengan header lengkap
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=3600", // 1 jam cache
        "Access-Control-Allow-Origin": "*", // 🟩 CORS fix
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    });
  } catch (error) {
    console.error("🔥 Proxy fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
