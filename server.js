import express from 'express';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'edge-tts';

const app = express();
const port = process.env.PORT || 3000;

app.get('/tts', async (req, res) => {
  const text = req.query.text;
  const voice = req.query.voice || 'km-KH-PisethNeural';

  if (!text) {
    return res.status(400).send('Please provide text');
  }

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const readable = tts.toStream(text);

    res.setHeader('Content-Type', 'audio/mpeg');
    readable.pipe(res);
  } catch (error) {
    res.status(500).send('Error generating audio: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
      
