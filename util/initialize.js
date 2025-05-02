const fs = require('fs');
const { JSDOM } = require('jsdom');
const { people, levels, blankImgTag } = require('./const');

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
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';


    /**
     * 테이블 행 삽입
     * 구조: 사람태그 > 날짜 태그 > 레벨 태그
     */
    createWeeklyTables(people, document);


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

function getMonthlyWeeks(year = new Date().getFullYear(), month = new Date().getMonth()) {
    const monthStart = new Date(year, month, 1); // 해당 월 1일
    const monthEnd = new Date(year, month + 1, 0); // 해당 월 말일

    // 시작: 5월 1일 포함 주의 월요일
    const start = new Date(monthStart);
    const startDay = start.getDay();
    const startOffset = startDay === 0 ? -6 : 1 - startDay;
    start.setDate(start.getDate() + startOffset);

    // 끝: 5월 말 포함 주의 일요일
    const end = new Date(monthEnd);
    const endDay = end.getDay();
    const endOffset = endDay === 0 ? 0 : 7 - endDay;
    end.setDate(end.getDate() + endOffset);

    const weeks = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(d);
            day.setDate(d.getDate() + i);
            week.push(new Date(day));
        }
        weeks.push(week);
    }
    return weeks;
}

function createWeeklyTables(people, document) {
    const weeks = getMonthlyWeeks();
    const container = document.getElementById('table-container');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const blankImageTag = `<div align='center'>${levels.map((level) => `<span class="${level.class}">${blankImgTag}</span>`).join("")}</div>`;

    weeks.forEach((weekDates) => {
        let table = '\n<table>';

        // 요일 헤더
        let thead = '\n  <thead>';
        let headerRow = '<tr><th></th>';
        weekDates.forEach(date => {
            headerRow += `<th>${pad(date.getMonth() + 1)}.${pad(date.getDate())} ${dayNames[date.getDay()]}</th>`;
        });
        thead += headerRow;
        table += thead;
        table += '</tr></thead>\n';

        let tbody = '  <tbody>\n';

        people.forEach(person => {
            let row = `    <tr id="${person.id}-tr">`;

            row += ` <td>${person.name}</td>\n`;

            weekDates.forEach(date => {
                const mmdd = pad(date.getMonth() + 1) + pad(date.getDate());
                const td = `      <td id="${mmdd}-td">${blankImageTag}</td>\n`;

                row += td;
            });

            row += "    </tr>\n"

            tbody += row;
        });

        tbody += '</tbody>';
        table += tbody;

        table += '\n</table>';

        container.innerHTML += table;
    });
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

initializeTable();