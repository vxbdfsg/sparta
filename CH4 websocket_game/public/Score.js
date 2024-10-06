import { sendEvent } from './Socket.js';

class Score {
    score = 0;
    HIGH_SCORE_KEY = 'highScore';
    stageChange = true;
    now = 1000;
    next = 1001;
    minscore = 50;
    scorePersecond = 1;
    stageData;
    itemData;
    itemUnlock = 1000;

    constructor(ctx, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.scaleRatio = scaleRatio;
        fetch('/assets')
            .then((response) => response.json())
            .then((data) => {
                this.stageData = data.stages;
                this.itemData = data.items;
            });
    }

    update(deltaTime) {
        this.score += deltaTime * 0.001 * this.scorePersecond;
        if (Math.floor(this.score) >= this.minscore && this.stageChange) {
            this.stageChange = false;
            sendEvent(11, { currentStage: this.now, targetStage: this.next });
            let idx = this.stageData.data.findIndex((stage) => stage.id === this.now);
            this.now = this.stageData.data[idx + 1]['id'];
            this.next = this.stageData.data[idx + 2]['id'];
            this.minscore = this.stageData.data[idx + 1]['score'];
            this.scorePersecond = this.stageData.data[idx]['scorePersecond'];

            // CustomEvent를 발생시켜 ItemController에 신호를 보냄
            if (this.now < 1006) this.itemUnlock = this.now;
            const event = new CustomEvent('stageChange', {
                detail: { newStage: this.itemUnlock },
            });
            window.dispatchEvent(event); // 이벤트 전송

            console.log(
                '스테이지 업데이트 시 : ',
                idx,
                this.now,
                this.next,
                this.minscore,
                this.stageChange,
                this.scorePersecond,
            );
            this.stageChange = true;
        }
    }

    getItem(itemId) {
        let earnScore = 0;
        console.log('아이템 데이터는 ', this.itemData.data[itemId - 1]);
        earnScore = +this.itemData.data[itemId - 1].score;

        this.score += earnScore;
        console.log(`추가된 점수: ${earnScore}, 현재 점수: ${Math.floor(this.score)}`);
        console.log('내가 먹은 아이템은', itemId);
    }

    reset() {
        this.score = 0;
    }

    setHighScore() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        if (this.score > highScore) {
            localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
        }
    }

    getScore() {
        return this.score;
    }

    draw() {
        const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
        const y = 20 * this.scaleRatio;

        const fontSize = 20 * this.scaleRatio;
        this.ctx.font = `${fontSize}px serif`;
        this.ctx.fillStyle = '#525250';

        const scoreX = this.canvas.width - 75 * this.scaleRatio;
        const highScoreX = scoreX - 125 * this.scaleRatio;

        const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
        const highScorePadded = highScore.toString().padStart(6, 0);

        this.ctx.fillText(scorePadded, scoreX, y);
        this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    }
}

export default Score;
