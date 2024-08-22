import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor(pname) {
    this.hp = 120; // 체력
    this.offense = 10; // 공격력
    this.double = 50; // 더블어택 확률
    this.pos = 0; // 더블어택 확률 증감
    this.healpos = 70; // 회복확률
    this.fleepos = 0; // 도망확률 증감
    this.mulattack = 1.0; // 공격력 증가율
    this.pcritical = 0; // 크리티컬 확률
    this.weak =  false; //플레이어 약화 여부
    this.vulnerable = false; // 플레이어 취약 여부

    this.name = pname; // 플레이어 네임 설정
  }

  attack(monster) {
    // 플레이어의 공격
    let textlog = ``; // 출력할 로그 모음
    let damage = this.offense + Math.floor(Math.random() * 11) - 3;
    // 크리티컬 시
    if(this.pcritical > Math.floor(Math.random(0, 1) * 101)) { 
      damage *= 2;
      this.pcritical = 0;
      textlog += `치명타! `;
    }
    else this.pcritical += 5; //크리티컬 아닐시

    //몬스터 데미지 계산
    monster.hp -= damage;

    // 플레이어 약화 시
    if(this.weak) {
      damage -= 5;
      this.weak = false;
    }

    textlog += `플레이어의 공격! ${damage}의 피해를 입힘!`;
    return textlog;
  }

  doubleAttack(monster) {
    // 플레이어의 더블어택
    let doudamage = this.offense * 2 + Math.floor(Math.random() * 41);

    // 플레이어 약화 시
    if(this.weak) {
      doudamage -= 10;
      this.weak = false;
    }
    if (Math.floor(Math.random(0, 1) * 101) < (this.double + this.pos * 5)) { // 성공시
      // 크리티컬 시
      if(this.pcritical > Math.floor(Math.random(0, 1) * 101)) { 
        doudamage *= 2;
        this.pcritical = 0;
      }
      // 크리티컬 아닐시
      else this.pcritical += 5; 
      monster.hp -= doudamage;
      this.pos = 0; // 더블어택 확률 초기화
      return `플레이어의 공격! ${doudamage}의 피해를 입힘!`;
    }
    else { // 실패시
      this.pos += 1; // 더블어택 확률 증가
      return `감나빗!`;
    }
  }

  heal() {
    //플레이어 체력회복
    if (Math.floor(Math.random(0, 1) * 101) < (this.healpos)) {
      let healhp = 30 + Math.floor(Math.random(0, 1) * 41); // 30~70의 체력 회복
      this.hp += healhp;
      return `${healhp}체력 회복!`;
    }
    else { // 실패시
      return `회복 실패!`;
    }
  }

  flee(monster) {
    //플레이어 도망
    if (Math.floor(Math.random(0, 1) * 101) + 20 * this.fleepos < 50) {
      monster.hp = 0; // 몬스터 사망처리로 전투 종료시킴
      this.fleepos += 1; // 도망 확률 증가
      if (this.fleepos >= 3) this.fleepos -= 1; // 최대 90%
      return '넌 다음에 보자!'
    }
    else {
      this.fleepos -= 1; // 도망 확률 감소
      if (this.fleepos <= -3) this.fleepos += 1; // 최소 10%
      return `도망칠 수 없다!`
    }
  }
}

class Monster {
  constructor(stage) {
    this.hp = 100 + stage * Math.floor(Math.random() * 11) + stage * 5;
    this.offense = 5 + stage * 3;
    this.mcritical = 0;
  }

  attack(player) {
    let textlog = ``; // 출력할 로그 모음

    // 몬스터의 공격
    let damage = this.offense + Math.floor(Math.random() * 5);

    // 크리티컬 시
    if(this.mcritical > Math.floor(Math.random(0, 1) * 101)) { 
      damage = Math.floor(1.5 * damage);
      this.mcritical = 0;
      textlog += `치명타! `;
    }
    // 크리티컬 아닐시
    else this.mcritical += 3;

    // 플레이어가 취약상태일 시
    if(player.vulnerable === true){
      player.vulnerable = false;
      damage += 5;
      textlog += `취약! `;
    }
    player.hp -= damage;
    textlog += `몬스터의 공격! ${damage}의 피해를 입힘!`;
    return textlog;
  }

  // 플레이어에게 취약과 약화를 부여하는 디버프
  debuf(player){
    //한번에 2가지가 안걸리게 변수로 저장
    let chkdebuf = Math.floor(Math.random(0, 1) * 100);

    //플레이어에게 취약디버프
    if(chkdebuf > 79) player.vulnerable = true;

    //플레이어에게 약화 디버프
    else if(chkdebuf < 20) player.weak = true;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status | Name : ${player.name} ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 정보 체력 : ${player.hp}, 공격력 : ${player.offense}, 치명타율 : ${player.pcritical} |`
    ) +
    chalk.redBright(
      `\n           | 몬스터 정보 체력 : ${monster.hp}, 공격력 : ${monster.offense}, 치명타율 : ${monster.mcritical} |`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

let history = [];

const battle = async (stage, player, monster) => {
  let logs = [];
  if(history[0] !== undefined) logs.push(history[0]);
  if(history[1] !== undefined) logs.push(history[1]);
  history = [];

  while (player.hp > 0) {
    console.clear();

    displayStatus(stage, player, monster);

    // 로그가 너무 길어지면 상단부분 삭제
    if(logs.length > 30) logs = logs.slice(3,);

    // 로그 출력
    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 \n2. 더블 어택/성공률 : ${player.double}+(${player.pos * 5})% `,
        `\n3. 회복/성공률 : 70% \n4. 도망가기 : 성공률 : ${50 - player.fleepos * 20}%`,
      ),
    );

    //플레이어 디버프시 로그 출력
    if(player.weak) console.log(chalk.red(`플레이어 약화!(주는 데미지 5 감소)`));
    else if(player.vulnerable) console.log(chalk.red(`플레이어 취약! (받는 데미지 5 증가)`));

    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

    let fleecheck = false; //전투가 도망으로 종료되는지 체크
    if (choice === '1') { // 공격
      logs.push(chalk.green(player.attack(monster)));
    }
    else if (choice === '2') { // 더블 어택
      logs.push(chalk.green(player.doubleAttack(monster)));
    }
    else if (choice === '3') { // 회복
      logs.push(chalk.green(player.heal()));
    }
    else if (choice === '4') { // 도망
      logs.push(chalk.green(player.flee(monster)));
      fleecheck = true;
    }

    if (monster.hp <= 0) {
      // 전투 종료시 플레이어 회복
      player.hp += 120 + Math.floor(Math.random(0, 1) * 60);

      // 사망시 로그출력
      logs.push(chalk.green(`몬스터 사망!`));

      // 도망시 로그출력
      if(fleecheck) logs.push(chalk.green(`넌 다음에 보자!`)); 

      // 전투종료시 플레이어 공격력 상승
      let mul = Math.floor(Math.random(0, 1) * 10 + 6) / 10; // 플레이어 공격 배수 증가량
      player.offense /= player.mulattack; // 기존의 증가량으로 나누고
      player.mulattack += mul; // 증가량을 더한 후
      player.offense = Math.ceil(player.offense * player.mulattack); // 증가량 곱함
      logs.push(chalk.green(`플레이어의 공격력이 ${mul}배 만큼 상승!`));
      
      // 치명타율 초기화
      player.pcritical = 0;
      break;
    }

    //몬스터 공격
    logs.push(chalk.redBright(monster.attack(player)));

    //몬스터 디버프
    monster.debuf(player);
  }
  // 마지막 로그 저장
  history.push(logs[logs.length - 2]);
  history.push(logs[logs.length - 1]);
};

export async function startGame(pname) {
  console.clear();
  const player = new Player(pname);
  let stage = 1;
  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    stage++;
  }

  console.log("게임이 마무리 되었습니다. 수고하셨습니다.");
}
