// ==UserScript==
// @name         超星 To Csv
// @version      0.1.1
// @description  将你的超星学习通里的作业数据、随堂练习导出成为 Csv 文件，方便导入 Anki 背题
// @author       Nexmoe
// @namespace     https://nexmoe.com/
// @match        *://*.chaoxing.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// ==/UserScript==

// 在此处键入代码……
let css = () => {
    let style = document.createElement("style");
    style.type = "text/css";
    let text = document.createTextNode("textarea { border: 1px solid; width: 100%; resize: none;}");
    style.appendChild(text);
    let head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
}

let generateTextArea = (data) => {
    let node = document.createElement("textarea");
    let textnode = document.createTextNode(data);
    node.appendChild(textnode);
    if (document.getElementsByClassName("detailsHead").length > 0) {
        document.getElementsByClassName("detailsHead")[0].appendChild(node);
    } else {
        document.getElementsByClassName("top-box")[0].appendChild(node);
    }
}

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

let saveFile = (data) => {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const Url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    if(document.getElementsByClassName("item-name").length > 0){
        link.download = document.getElementsByClassName("item-name")[0].innerText+'.csv';	//文件名字
    } else {
        link.download = document.getElementsByClassName("mark_title")[0].innerText+'.csv';	//文件名字
    }
    
    link.href = Url;
    link.appendChild(document.createTextNode('下载题目数据'));
    if (document.getElementsByClassName("detailsHead").length > 0) {
        document.getElementsByClassName("detailsHead")[0].appendChild(link);
    } else {
        document.getElementsByClassName("top-box")[0].appendChild(link);
    }
}

let getData = (i, data = []) => {
    let questions, selections, answers;
    if (document.getElementsByClassName("mark_name").length > 0) {
        questions = document.getElementsByClassName("mark_name");
        selections = document.getElementsByClassName("mark_letter");
        answers = document.getElementsByClassName("colorGreen");
    } else {
        questions = document.getElementsByClassName("topic-title");
        selections = document.getElementsByClassName("topic-options");
        answers = document.getElementsByClassName("color-green");

    }

    for (i = 0; i < questions.length; i++) {
        data.push({
            question: questions[i].innerText.replace(
                new RegExp(",", "gm"),
                "，"
            ).replace(
                new RegExp("\n", "gm"),
                ""
            ),
            selection: selections[i].innerText.replace(
                new RegExp("\n", "gm"),
                "***"
            ).replace(
                new RegExp(",", "gm"),
                "，"
            ),
            answer: answers[i].innerText.replace("正确答案: ", "").replace(
                new RegExp(",", "gm"),
                "，"
            ).replace(
                new RegExp("对", "gm"),
                "A"
            ).replace(
                new RegExp("错", "gm"),
                "B"
            )
        })
    }
    console.log(data)
    return data;
}

(function () {
    css();
    if (document.getElementsByClassName("mark_name").length > 0) {
        generateTextArea(JSON.stringify(getData()));
        saveFile(ConvertToCSV(JSON.stringify(getData())));
    } else {
        setTimeout(() => {
            generateTextArea(JSON.stringify(getData()));
            saveFile(ConvertToCSV(JSON.stringify(getData())));
        }, 1000)
    }
})();