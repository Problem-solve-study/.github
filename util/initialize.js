const fs = require('fs');
const { JSDOM } = require('jsdom');
const { people, levels } = require('./const');

const today = new Date();
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * 테이블 초기화
 * 리드미 읽기 -> 테이블 초기화 -> 이번 달 행 삽입 -> 리드미 저장
 */

async function initializeTable() {
    /*
    * 리드미 읽기
    * README 파일을 읽어 document를 구성합니다.
    */
    let readmeData;
    try {
        readmeData = await fs.promises.readFile('../profile/README.md', 'utf8');
        console.log('[INFO] README 파일 열기 성공')
    } catch (err) {
        console.error('[ERROR] README 파일 열기 실패: ', err);
        return;
    }

    const dom = new JSDOM(readmeData, { contentType: "text/html" });
    const document = dom.window.document;


    /**
     * 테이블 바디 초기화
     */
    const tableBody = document.getElementById('problem-solve-table-body');
    tableBody.innerHTML = '';

    /**
     * 테이블 행 삽입
     * 구조: 행 태그 > 날짜 태그 > 사람 태그 > 레벨 태그
     */
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const weekday = weekdays[date.getDay()];

        // 행 태그
        let rowText = `\n    <tr id='${month}${day}-tr'>`;

        // 날짜 태그
        let dateTdText = ` <td align='center'> ${month}.${day}. ${weekday} </td>\n`;
        rowText += dateTdText;

        // 사람별 태그
        for (let person of people) {
            let personTdText = `      <td class='${person.id}-td'><div align='center'>${levels.map((level) => `<span class="${level.class}"><img src="blank.svg" height="16px"></span>`).join("")}</div></td>\n`;
            rowText += personTdText;
        }

        rowText += '    </tr>';
        tableBody.innerHTML += rowText;
    }


    /**
     * 리드미 저장
     */
    // html 태그 제거
    let text = dom.serialize();
    text = text.replace(/<html><head><\/head><body>/g, '\n').replace(/<\/body><\/html>/g, '');

    // 리드미 업데이트
    try {
        await fs.promises.writeFile('../profile/README.md', text, 'utf8');
        succed = true;
        console.log('[INFO] README 파일 저장 성공');
    } catch (err) {
        console.error('[ERROR] README 파일 저장 실패:', err);
    }
}

initializeTable();