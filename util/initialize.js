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
    const weeks = getMayWeeks();
    const container = document.getElementById('table-container');
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

    weeks.forEach((weekDates, weekIndex) => {
        const table = document.createElement('table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const emptyTh = document.createElement('th');
        headerRow.appendChild(emptyTh);

        weekDates.forEach(date => {
            const th = document.createElement('th');
            const mm = pad(date.getMonth() + 1);
            const dd = pad(date.getDate());
            const dayName = getDayNameKR(date);
            th.textContent = `${mm}.${dd} ${dayNames[date.getDay()]}`;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        people.forEach(person => {
            const row = document.createElement('tr');
            row.id = `${person.id}-tr`;

            const nameTd = document.createElement('td');
            nameTd.textContent = person.name;
            row.appendChild(nameTd);

            weekDates.forEach(date => {
            const mmdd = pad(date.getMonth() + 1) + pad(date.getDate());
            const td = document.createElement('td');
            td.id = `${mmdd}-td`;
            row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    });
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

initializeTable();