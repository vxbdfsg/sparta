import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import {startGame} from "./game.js";

// 로비 화면을 출력하는 함수
function displayLobby() {
    console.clear();

    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('RL- Javascript', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    const line = chalk.magentaBright('='.repeat(50));
    console.log(line);

    // 게임 이름
    console.log(chalk.yellowBright.bold('CLI 게임에 오신것을 환영합니다!'));

    // 설명 텍스트
    console.log(chalk.green('옵션을 선택해주세요.'));
    console.log();

    // 옵션들
    console.log(chalk.blue('1.') + chalk.white(' 새로운 게임 시작'));
    console.log(chalk.blue('2.') + chalk.white(' 업적 확인하기'));
    console.log(chalk.blue('3.') + chalk.white(' 이름 설정'));
    console.log(chalk.blue('4.') + chalk.white(' 종료'));

    // 하단 경계선
    console.log(line);

    // 하단 설명
    console.log(chalk.gray('1-4 사이의 수를 입력한 뒤 엔터를 누르세요.'));
}

//플레이어 이름 변수 설정
let name = "Player";

// 유저 입력을 받아 처리하는 함수
function handleUserInput() {
    const choice = readlineSync.question('입력: ');

    switch (choice) {
        case '1':
            console.log(chalk.green('게임을 시작합니다.'));
            // 여기에서 새로운 게임 시작 로직을 구현
            startGame(name);
            break;
        case '2':
            console.log(chalk.yellow('구현 준비중입니다.. 게임을 시작하세요'));
            // 업적 확인하기 로직을 구현
            handleUserInput();
            break;
        case '3':
            console.log(chalk.blue('플레이어의 이름을 설정할 수 있습니다.'));
            // 옵션 메뉴 - 플레이어 이름 변경
            name = gameOption();
            handleUserInput();
            break;
        case '4':
            console.log(chalk.red('게임을 종료합니다.'));
            // 게임 종료 로직을 구현
            process.exit(0); // 게임 종료
            break;
        default:
            console.log(chalk.red('올바른 선택을 하세요.'));
            handleUserInput(); // 유효하지 않은 입력일 경우 다시 입력 받음
    }
}

//플레이어 이름 변경 함수
function gameOption() {
    const name = readlineSync.question('플레이어의 이름 입력: ');
    console.log(chalk.green(`플레이어의 이름이 ${name}으로 설정되었습니다.`))
    return name;
}

// 게임 시작 함수
function start() {
    displayLobby();
    handleUserInput();
}

// 게임 실행
start();