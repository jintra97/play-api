async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
      })
    });
  
    if (!response.ok) {
      throw new Error("Fout bij ophalen access token");
    }
  
    const data = await response.json();
    return data.access_token;
  }
  
  export default async function handler(req, res) {
    try {
      const accessToken = await getAccessToken();
  
      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      if (response.status === 204 || response.status > 400) {
        return res.status(200).json({ message: "het is stil in jintra's airpods..." });
      }
  
      const data = await response.json();
      res.status(200).json({
        song: data.item.name,
        artist: data.item.artists.map(artist => artist.name).join(", "),
        albumImage: data.item.album.images[0].url
      });
    } catch (error) {
      console.error("Fout in API:", error);
      res.status(500).json({ error: "Kon gegevens niet ophalen" });
    }
  }
  