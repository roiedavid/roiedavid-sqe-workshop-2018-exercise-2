import * as esprima from 'esprima';
import * as estraverse from 'estraverse';
import * as escodegen from 'escodegen';

// parseCode : string -> ast
const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse ,{loc:true});
};

// astToCode : ast -> string
const astToCode = (ast) => {
    return escodegen.generate(ast);
};

// esprima ast represents the function's args -> array of values
function getArgsValues(parsedArgs) {
    let expression = parsedArgs.body[0].expression;
    if (expression.type === 'SequenceExpression') // case for more than one arguments
        return expression.expressions.map(exp => eval(astToCode(exp)));
    return [eval(astToCode(expression))]; // only one argument
}

// Performs symbolic substitution on a function with given args
function symbolicSubstitution(parsedCode, parsedArgs) {
    let params = [], varTable = [], args = getArgsValues(parsedArgs);
    parsedCode = parsedCode.body[0];
    for (let i = 0 ; i< parsedCode.params.length; i++)
        params.push(astToCode(parsedCode.params[i])); // params is array of the function's params names
    substitute(parsedCode, params, varTable); // static substitution. replace local vars with params expressions
    parsedCode = parseCode(removeEmptyStatements(astToCode(parsedCode))); // get rid of EmptyStatements
    parsedCode = parseCode(astToCode(parsedCode)); // updates lines
    let linesColorsArray = pathColoring(parsedCode, generateBindings(params,args));
    return {function: parsedCode, linesColorsArray:linesColorsArray};
}

const substituteHandlersMap = {'VariableDeclaration': substituteVariableDeclarationHandler,
    'IfStatement': substituteIfStatementHandler , 'WhileStatement': substituteWhileStatementHandler,
    'ExpressionStatement': substituteAssignmentExpressionHandler, 'ReturnStatement': substituteReturnStatementHandler};

function runFunc(func, node, params, varTable) {
    return  func ? func(node, params, varTable) : varTable;
}

function substitute(ast, params, varTable) {
    estraverse.replace(ast, {
        enter: function (node) {
            let func = substituteHandlersMap[node.type];
            varTable = runFunc(func, node, params, varTable);
            if (node.type === 'VariableDeclaration')
                this.remove();
            else if (node.type === 'ExpressionStatement' && node.expression.type === 'AssignmentExpression') {
                if (!params.includes(astToCode(node.expression.left)))
                    this.remove();
            }
        }
    });
    return varTable;
}

function substituteVariableDeclarationHandler(node, params, varTable){
    for (let i = 0; i < node.declarations.length; i++) {
        let name = astToCode(node.declarations[i].id);
        let value = astToCode(getValueAsParamsExp(node.declarations[i].init, params, varTable)).replace(/;/g, '');
        varTable.push({name:name, value: value});
    }
    return varTable;
}

function substituteIfStatementHandler(node, params, varTable) {
    let newTest = escodegen.generate(getValueAsParamsExp(node.test, params, varTable)).replace(/;/g, '');
    node.test = parseCode(newTest).body[0].expression;
    let scopeVarTable = JSON.parse(JSON.stringify(varTable)); // deep copy of varTable
    for (let i = 0; i < node.consequent.body.length; i++){
        let currentNode = node.consequent.body[i];
        if (currentNode.type === 'ExpressionStatement' && currentNode.expression.type === 'AssignmentExpression') {
            scopeVarTable = substituteAssignmentExpressionHandler(currentNode, params, scopeVarTable);
            if (!params.includes(astToCode(currentNode.expression.left)))
                node.consequent.body[i] = parseCode(';');
        }
        else
            scopeVarTable = substitute(currentNode, params, scopeVarTable);
    }
    return varTable;
}

function substituteWhileStatementHandler(node, params, varTable) {
    let newTest = astToCode(getValueAsParamsExp(node.test, params, varTable)).replace(/;/g, '');
    node.test = parseCode(newTest).body[0].expression;
    let scopeVarTable = JSON.parse(JSON.stringify(varTable)); // deep copy of varTable
    substitute(node.body, params, scopeVarTable);
    return varTable;
}

function substituteAssignmentExpressionHandler(expressionStatementNode, params, varTable) {
    if(expressionStatementNode.expression.type !== 'AssignmentExpression')
        return varTable;
    let name = astToCode(expressionStatementNode.expression.left);
    let value = astToCode(getValueAsParamsExp(expressionStatementNode.expression.right, params, varTable)).replace(/;/g, '');
    for (let i = 0; i < varTable.length; i++)
        if(varTable[i].name === name)
            varTable[i] = {name: name, value: value, line: expressionStatementNode.loc.start.line};
    expressionStatementNode.expression.right = parseCode(value).body[0].expression;
    return varTable;
}

function substituteReturnStatementHandler(node, params, varTable) {
    let newReturn = astToCode(getValueAsParamsExp(node.argument, params, varTable)).replace(/;/g, '');
    node.argument = parseCode(newReturn).body[0].expression;
    return varTable;
}

function getValueAsParamsExp(value, params, varTable) {
    return estraverse.replace(value, {
        enter: function (node) {
            if (isLocalVariable(node, params)) {
                for (let i = 0; i < varTable.length; i++)
                    if(varTable[i].name === astToCode(node))
                        return parseCode(varTable[i].value).body[0];
            }
            if(node.type === 'BinaryExpression')
                return removeZeroFromBinaryExpression(node);
        }
    });
}

function isLocalVariable(node, params) {
    return node.type === 'Identifier' && !params.includes(astToCode(node));
}

function removeZeroFromBinaryExpression(node) {
    if(astToCode(node.left) === '0')
        return node.right;
    if(astToCode(node.right) === '0')
        return node.left;
}

function removeEmptyStatements(codeString) {
    let newCodeString = '', codeLinesArray = codeString.split('\n');
    for (let i = 0 ; i< codeLinesArray.length; i++)
        if (!isEmptyLine(codeLinesArray[i]))
            newCodeString += codeLinesArray[i];
    return newCodeString;
}

function isEmptyLine(codeLine) {
    for (let i = 0; i < codeLine.length; i++)
        if (!(codeLine[i] === ' ' || codeLine[i] === ';'))
            return false;
    return true;
}

function generateBindings(params,args) {
    let bindings = {};
    for (let i = 0 ; i < params.length; i++)
        bindings[params[i]]=args[i];
    return bindings;
}

function pathColoring(functionDeclaration, bindings) {
    let linesColorsArray = [];
    estraverse.traverse(functionDeclaration, {
        enter: function (node) {
            if (node.type === 'IfStatement') {
                let testRes = evalTest(node.test, bindings);
                linesColorsArray.push({line: node.loc.start.line, color: testRes ? 'chartreuse' : 'red'});
            }
        }
    });
    return linesColorsArray;
}

function evalTest(test, bindings) {
    // deep copy, don't want to sub input vector params to values and show it on output
    let newTest = JSON.parse(JSON.stringify(test));
    newTest = replaceTestVariablesByValues(newTest, bindings);
    return eval(astToCode(newTest));
}

function replaceTestVariablesByValues(test, bindings) {
    return estraverse.replace(test, {
        enter: function (node) {
            if (node.type === 'Identifier') {
                let name  = astToCode(node);
                let value = bindings[name];
                return parseCode(JSON.stringify(value)).body[0].expression;
            }
        }
    });
}

export {parseCode, astToCode, symbolicSubstitution};