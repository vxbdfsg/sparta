import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets, getGameAssets } from './init/asset.js';
import { getStage } from './models/stage.models.js';

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
initSocket(server);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/assets', (req, res) => {
    const assets = getGameAssets();
    res.json(assets);
});

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // 이 곳에서 파일 읽음
    try {
        const assets = await loadGameAssets();
        //console.log(assets.itemUnlocks.data);
        console.log('Assets loaded successfully');
    } catch (e) {
        console.error('Failed to load game asstes : ', e);
    }
});
