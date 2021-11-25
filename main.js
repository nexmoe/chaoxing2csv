// ==UserScript==
// @name         超星 To Csv
// @version      0.1.0
// @description  将你的超星学习通里的作业数据导出成为 Csv 文件，方便导入 Anki 背题
// @author       Nexmoe
// @match        *://*.chaoxing.com/*
// @grant        GM_setValue
// @grant        GM_getValue
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
    document.getElementsByClassName("detailsHead")[0].appendChild(node);
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
    link.download = `data.csv`;	//文件名字
    link.href = Url;
    link.appendChild(document.createTextNode('下载题目数据'));
    document.getElementsByClassName("detailsHead")[0].appendChild(link);
}

let getHomeworkData = (i, data = []) => {
    let questions = document.getElementsByClassName("mark_name");
    let selections = document.getElementsByClassName("mark_letter");
    let answers = document.getElementsByClassName("colorGreen");
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
    'use strict';
    css();
    generateTextArea(JSON.stringify(getHomeworkData()));
    saveFile(ConvertToCSV(JSON.stringify(getHomeworkData())));
})();