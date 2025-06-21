import { NextResponse, type NextRequest } from "next/server";
import { OPENROUTER_BASE_URL } from "@/constants/urls";

export const runtime = "edge";
export const preferredRegion = [
  "sin1",  // 🇸🇬 新加坡
  "hnd1",  // 🇯🇵 日本东京
  "kix1",  // 🇯🇵 日本大阪
  "hkg1",  // 🇭🇰 香港
];

const API_PROXY_BASE_URL =
  process.env.OPENROUTER_API_BASE_URL || OPENROUTER_BASE_URL;

async function handler(req: NextRequest) {
  let body;
  if (req.method.toUpperCase() !== "GET") {
    body = await req.json();
  }
  const searchParams = req.nextUrl.searchParams;
  const path = searchParams.getAll("slug");
  searchParams.delete("slug");
  const params = searchParams.toString();

  try {
    let url = `${API_PROXY_BASE_URL}/api/${decodeURIComponent(path.join("/"))}`;
    if (params) url += `?${params}`;
    console.log(url);
    const payload: RequestInit = {
      method: req.method,
      headers: {
        "Content-Type": req.headers.get("Content-Type") || "application/json",
        Authorization: req.headers.get("Authorization") || "",
      },
    };
    if (body) payload.body = JSON.stringify(body);
    const response = await fetch(url, payload);
    return new NextResponse(response.body, response);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json(
        { code: 500, message: error.message },
        { status: 500 }
      );
    }
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
