import { geoService } from "@/lib/geo/geoService";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  try {
    if (type === "search") {
      const q = searchParams.get("q");
      return Response.json(await geoService.search(q));
    }

    if (type === "reverse") {
      const lat = searchParams.get("lat");
      const lon = searchParams.get("lon");
      return Response.json(await geoService.reverse(lat, lon));
    }

    return Response.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: "Geo error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (body.type === "route") {
      return Response.json(
        await geoService.route(body.pickupCoords, body.dropCoords),
      );
    }

    return Response.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    return Response.json({ error: "Route error" }, { status: 500 });
  }
}
