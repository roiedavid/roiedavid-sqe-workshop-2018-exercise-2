import $ from 'jquery';
import {parseCode, astToCode, symbolicSubstitution} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse); // string -> ast
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        let substituted = symbolicSubstitution(parsedCode); // returns {func, linesColorsArray}
        let substitutedCode = astToCode(substituted.function); // ast -> string
        let substitutedCodeLines = substitutedCode.split('\n'); // split output string to lines array
        clearSubstitutedCode(); // clears page if it's already has code output from previous running
        showSubstitutedCode(substitutedCodeLines, substituted.linesColorsArray);
    });
});

function showSubstitutedCode(substitutedCodeLines, linesColorsArray) {
    let htmlCodeObj = document.getElementById('substitutedCode'); // get substitutedCode html paragraph
    for (let i = 0; i < substitutedCodeLines.length; i++) { // remove empty lines loop
        let nextLine = document.createElement('line' + i); // next line to show
        nextLine.appendChild(document.createTextNode(substitutedCodeLines[i])); // add it's code text
        nextLine.setAttribute('style', 'background-color: '+ getColor(linesColorsArray, i+1) +';');
        htmlCodeObj.appendChild(nextLine);
        htmlCodeObj.appendChild(document.createElement('br')); // add new line
    }
    htmlCodeObj.setAttribute('style', 'font-size:25px; white-space: pre;');
}

function getColor(linesColorsArray, line) {
    for (let i = 0; i < linesColorsArray.length; i++)
        if (linesColorsArray[i].line === line && linesColorsArray[i].color !== 'white')
            return linesColorsArray[i].color;
    return 'white';
}

function clearSubstitutedCode() {
    document.getElementById('substitutedCode').innerHTML = '';
}