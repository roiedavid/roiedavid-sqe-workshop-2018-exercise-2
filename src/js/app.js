import $ from 'jquery';
import {parseCode, extract} from './code-analyzer';

let rowNum = 0;

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        clearTable();
        showTable(extract(parsedCode));
    });
});

function showTable(tuplesArray) {
    let body = document.getElementsByTagName('body')[0] , table = document.createElement('table'), tableBody = document.createElement('table_body'),
        caption = document.createElement('caption');
    table.id = 'resultTable';
    table.setAttribute('style','font-family: arial; border-collapse: collapse;');
    caption.appendChild(document.createTextNode('Result'));
    caption.setAttribute('style', 'font:arial; font-size:150% ; font-weight: bold;');
    tableBody.setAttribute('style', 'font-family: arial; font-size:130%;');
    tableBody.appendChild(caption);
    tableBody.appendChild(initTitles());
    for (let i = 0; i < tuplesArray.length; i++)
        tableBody.appendChild(addTuple(tuplesArray[i]));
    table.appendChild(tableBody);
    body.appendChild(table);
}

function initTitles() {
    let tr = document.createElement('tr');
    let th1 = document.createElement('th'), th2 = document.createElement('th'), th3 = document.createElement('th'), th4 = document.createElement('th'),
        th5 = document.createElement('th');

    th1.appendChild(document.createTextNode('line'));
    th2.appendChild(document.createTextNode('type'));
    th3.appendChild(document.createTextNode('name'));
    th4.appendChild(document.createTextNode('condition'));
    th5.appendChild(document.createTextNode('value'));

    appendChildren(tr,[th1,th2,th3,th4,th5]);
    setAttributes([th1,th2,th3,th4,th5],'style', 'border: 1px solid #dddddd; padding: 8px;');
    return tr;
}

function addTuple(tuple){
    let tr = document.createElement('tr'), td1 = document.createElement('td'), td2 = document.createElement('td'), td3 = document.createElement('td'),
        td4 = document.createElement('td'), td5 = document.createElement('td');

    td1.appendChild(document.createTextNode(tuple.line));
    td2.appendChild(document.createTextNode(tuple.type));
    td3.appendChild(document.createTextNode(tuple.name));
    td4.appendChild(document.createTextNode(tuple.condition));
    td5.appendChild(document.createTextNode(tuple.value));

    setAttributes([td1,td2,td3,td4,td5],'style','border: 1px solid #dddddd; text-align: left; padding: 8px;');
    if(rowNum%2 === 0)
        tr.style.backgroundColor = 'lightblue';
    rowNum++;
    appendChildren(tr,[td1,td2,td3,td4,td5]);
    return tr;
}

function appendChildren(father,childrenArray) {
    for (let i = 0 ; i < childrenArray.length ; i++)
        father.appendChild(childrenArray[i]);
}

function setAttributes(arr,qualifiedName,value) {
    for (let i = 0 ; i < arr.length ; i++)
        arr[i].setAttribute(qualifiedName,value);
}

function clearTable() {
    rowNum = 0;
    let table = document.getElementById('resultTable');
    if(table!==null)
        table.remove();
}