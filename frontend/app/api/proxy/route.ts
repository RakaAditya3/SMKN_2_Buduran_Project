import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
  }

  try {
    // ✅ Ambil dari backend Laravel
    const res = await fetch(imageUrl, {
      headers: {
        Accept: "image/*",
      },
      cache: "no-store",
    });

    // Jika gagal ambil
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch: ${res.statusText}" },
        { status: res.status }
      );
    }

    // Ambil data binary (image)
    const arrayBuffer = await res.arrayBuffer();

    // ✅ Tambahkan header agar browser mengizinkan tampilkan
    const response = new Response(arrayBuffer, {
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=3600", // 1 jam cache
        "Access-Control-Allow-Origin": "*", // 🟩 FIX utama
      },
    });

    return response;
  } catch (error) {
    console.error("Proxy fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}