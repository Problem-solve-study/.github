const fs = require('fs');
const { JSDOM } = require('jsdom');
const { people, levels } = require('./const');

const today = new Date();
const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

// 테이블을 이번달로 초기화
fs.readFile('README.md', 'utf8', (err, data) => {
    if (err) {
        console.error('파일 읽기 오류:', err);
        return;
    }
    const dom = new JSDOM(data, { contentType: "text/html" });
    const document = dom.window.document;

    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // 테이블 바디 초기화
    const tableBody = document.getElementById('problem-solve-table-body');
    tableBody.innerHTML = '';

    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const weekday = weekdays[date.getDay()];

        // 행 태그
        let rowText = `\n    <tr id='${month}${day}-tr'>`;

        // 날짜 태그
        let dateTdText = ` <td> ${month}.${day}. ${weekday} </td>\n`;
        rowText += dateTdText;

        // 사람별 태그
        for (let person of people) {
            let personTdText = `      <td class='${person.id}-td'>${levels.map((level) => ` <span class="${level.class}"></span>`).join(" ")} </td>\n`;
            rowText += personTdText;
        }

        rowText += '    </tr>';
        tableBody.innerHTML += rowText;
    }

    // html 태그 제거
    let text = dom.serialize();
    text = text.replace(/<html><head><\/head><body>/g, '\n').replace(/<\/body><\/html>/g, '');

    fs.writeFile('README.md', text, 'utf8', (err) => {
        if (err) {
            console.error('파일 저장 오류:', err);
        } else {
            console.log('파일이 성공적으로 저장되었습니다.');
        }
    });
});