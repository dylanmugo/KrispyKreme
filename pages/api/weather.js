export default async function handler(req, res) {
    if (req.method === 'GET') {
      const apiKey = process.env.WEATHER_API_KEY; // Ensure this is set in .env.local
      const { city } = req.query;
  
      if (!city) {
        return res.status(400).json({ message: 'City is required' });
      }
  
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
  
        if (response.ok) {
          res.status(200).json(data);
        } else {
          res.status(400).json({ message: data.message || 'Error fetching weather data' });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  