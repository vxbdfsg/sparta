import { getGameAssets } from '../init/asset.js';
import { getStage, setStage } from '../models/stage.models.js';

export const moveStageHandler = (userId, payload) => {
    // 유저의 현재 스테이지 정보
    let currentStages = getStage(userId);
    if (!currentStages.length) {
        return { status: 'fail', message: 'No stages found for user' };
    }

    // 가장 큰 스테이지 ID 확인 -> 오름차순 (유저의 현재 스테이지)
    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];

    // 클라이언트 vs 서버 비교
    if (currentStage.id !== payload.currentStage) {
        return { status: 'fail', message: 'Current stage mismatch' };
    }

    // targetStage 검증 <- 게임에셋에 존재하는가?
    const { stages } = getGameAssets();
    if (!stages.data.some((stage) => stage.id === payload.targetStage)) {
        console.log(payload.targetStage)
        return { status: 'fail', message: 'Target stage not found' };
    }

    // 현재 스테이지와 점수가 일치하는지 확인
    const serverTime = Date.now();
    const elapsedTime = (serverTime - currentStage.timestamp) / 1000;
    console.log("현재", currentStages)

    // 1스테이지에서 2스테이지로 넘어가는 과정 검증
    // if (elapsedTime < 9.6 || elapsedTime > 10.5) {
    //     return { status: 'fail', message: 'invalid elapsed time' };
    // }

    setStage(userId, payload.targetStage, serverTime);

    return { status: 'success' };
};
