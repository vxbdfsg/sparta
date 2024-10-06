import { getGameAssets } from '../init/asset.js';
import { getStage, setStage, clearStage } from '../models/stage.models.js';

export const gameStart = (uuid, payload) => {
    const { stages } = getGameAssets();
    clearStage(uuid);
    setStage(uuid, stages.data[0].id, payload.timestamp);
    console.log('Stage:', getStage(uuid));

    return { status: 'success' };
};

export const gameEnd = () => {
    // 클라이언트는 게임 종료 시 타임스탬프와 총 점수를 전달
    const { timestamp: gameEndTime, score } = [payload];
    const stages = getStage(uuid);

    if (!stages.length) return { status: 'fail', message: 'No stages found for user' };

    let totalScore = 0;

    stages.forEach((stage, idnex) => {
        let stageEndTime;

        if (index === stages.length - 1) stageEndTime = gameEndTime;
        else stageEndTime = stages[index + 1].timestamp;

        const stageDuration = (stageEndTime - stage.timestamp) / 1000;
        totalScore += stageDuration;
    });

    // 점수와 타임스탬프 검증
    if (Math.abs(score - totalScore) > 5)
        return { status: 'fail', message: 'Score verification failed' };

    // DB 저장한다고 가정하면
    // setResult(userId, score, timestamp)

    return { status: 'success', message: 'Game ended', score };
};
