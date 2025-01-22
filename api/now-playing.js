export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // of specifieker: "http://localhost:3000"
    res.setHeader("Access-Control-Allow-Methods", "GET");
  
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`
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
  