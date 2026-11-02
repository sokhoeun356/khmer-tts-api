const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Khmer TTS API is running!');
});

app.get('/tts', async (req, res) => {
  const text = req.query.text;
  if (!text) {
    return res.status(400).send('Please provide text query parameter.');
  }

  try {
    // ប្រើ dynamic import ដើម្បីដំណើរការ library edge-tts
    const { MsEdgeTTS, OUTPUT_FORMAT } = await import('edge-tts');
    const tts = new MsEdgeTTS();
    await tts.setMetadata('km-KH-PisethNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const readable = tts.toStream(text);

    res.setHeader('Content-Type', 'audio/mpeg');
    readable.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating TTS');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
