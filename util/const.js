const people = [
    { id: "ksh", name: "권수현", username: "kwonssshyeon" },
    { id: "kci", name: "김채일", username: "LES8638" },
    { id: "pjh", name: "박주현", username: "yeochi1201" },
    { id: "pjw", name: "박재완", username: "jaewan1230" },
    { id: "pdh", name: "백대환", username: "DoDoGaMaRu" },
    { id: "shs", name: "손현수", username: "Untaini" },
    { id: "yjs", name: "윤준석", username: "JunSeok-Yun" },
    { id: "jhj", name: "정현정", username: "wgwjh05169" },
    { id: "hsm", name: "한성민", username: "winteeeee" },
    { id: "hmg", name: "홍민기", username: "hmk5940" }
];

const levels = [
    { class: 'easy', tag: 'E', imgTag: '<img src="silver.svg" height="20px" />'},
    { class: 'normal', tag: 'N', imgTag: '<img src="gold.svg" height="20px" />'},
    { class: 'hard', tag: 'H', imgTag: '<img src="platinum.svg" height="20px" />'},
]

const blankImgTag ='<img src="blank.svg" height="20px" />';

const lastUpdate = '309eef5f4436f2a241bd4feeee36aca49b269e2d';

module.exports = { people, levels, lastUpdate, blankImgTag };

