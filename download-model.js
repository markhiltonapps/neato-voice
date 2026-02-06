import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
    "config.json",
    "tokenizer.json",
    "tokenizer_config.json",
    "preprocessor_config.json",
    "model_quantized.onnx"
];

const baseUrl = "https://huggingface.co/Xenova/whisper-tiny.en/resolve/main";
const destDir = path.join(__dirname, 'web/public/models/Xenova/whisper-tiny.en');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

function downloadFile(file) {
    const url = `${baseUrl}/${file}`;
    const dest = path.join(destDir, file);
    const fileStream = fs.createWriteStream(dest);

    console.log(`Downloading ${file}...`);

    https.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
            https.get(response.headers.location, (redirectResponse) => {
                redirectResponse.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Saved ${file}`);
                });
            });
        } else {
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Saved ${file}`);
            });
        }
    }).on('error', (err) => {
        console.error(`Error downloading ${file}:`, err);
    });
}

files.forEach(downloadFile);
