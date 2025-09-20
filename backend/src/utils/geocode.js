import axios from "axios";

export async function geocodeVillage(village, district, state) {
  const q = `${village}, ${district}, ${state}`;
  const url = `https://nominatim.openstreetmap.org/search`;
  try {
    const resp = await axios.get(url, {
      params: { q, format: "json", limit: 1 },
      headers: { "User-Agent": "AyushTrace/1.0 (contact@yourdomain.com)" },
    });
    if (Array.isArray(resp.data) && resp.data.length) {
      return {
        lat: parseFloat(resp.data[0].lat),
        lon: parseFloat(resp.data[0].lon),
      };
    }
  } catch (err) {
    console.warn("Geocode failed", err.message);
  }
  return null;
}
