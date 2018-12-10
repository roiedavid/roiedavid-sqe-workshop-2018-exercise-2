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

function initVarTable(parsedCode) {
    let varTable = [];
    estraverse.traverse(parsedCode, {
        enter: function (node) {
            if (node.type === 'VariableDeclaration')
                globalVariableDeclarationHandler(node, varTable);
            if (node.type === 'AssignmentExpression')
                globalAssignmentExpressionHandler(node, varTable);
            if (node.type === 'FunctionDeclaration')
                this.skip();
        }
    });
    return varTable;
}

function globalVariableDeclarationHandler(node, varTable) {
    for (let i = 0; i < node.declarations.length; i++)
        varTable.push({name: astToCode(node.declarations[i].id), value: astToCode(node.declarations[i].init)});
}

function globalAssignmentExpressionHandler(node, varTable) {
    for (let i = 0; i < varTable.length; i++)
        if (varTable[i].name === astToCode(node.left))
            varTable[i] = {name: astToCode(node.left), value: astToCode(node.right)};
}

function getFunctionDecl(parsedCode) {
    for (let i = 0 ; i < parsedCode.body.length; i++)
        if(parsedCode.body[i].type === 'FunctionDeclaration')
            return parsedCode.body[i];
}

function initParams(parsedFunction) {
    let params = [];
    for (let i = 0 ; i < parsedFunction.params.length; i++)
        params.push(astToCode(parsedFunction.params[i])); // params is array of the function's params names
    return params;
}

// esprima ast represents the function's args -> array of values
function getArgsValues(parsedArgs) {
    let expression = parsedArgs.body[0].expression;
    if (expression.type === 'SequenceExpression') // case for more than one arguments
        return expression.expressions.map(exp => eval(astToCode(exp)));
    return [eval(astToCode(expression))]; // only one argument
}

// Performs symbolic substitution on a function with given args
function symbolicSubstitution(parsedCode, parsedArgs) {
    let varTable = initVarTable(parsedCode), parsedFunction= getFunctionDecl(parsedCode), params = initParams(parsedFunction), args = getArgsValues(parsedArgs);
    substitute(parsedFunction, params, varTable); // static substitution. replace local vars with params expressions
    parsedFunction = parseCode(removeEmptyStatements(astToCode(parsedFunction))); // get rid of EmptyStatements
    parsedFunction = parseCode(astToCode(parsedFunction)); // updates lines
    let linesColorsArray = pathColoring(parsedFunction, generateBindings(params, args, varTable));
    return {function: parsedFunction, linesColorsArray: linesColorsArray};
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
    let newTest = astToCode(getValueAsParamsExp(node.test, params, varTable)).replace(/;/g, '');
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
    let found = false;
    for (let i = 0; i < varTable.length && !found; i++)
        if (varTable[i].name === name) {
            varTable[i] = {name: name, value: value};
            found = true;
        }
    if(!found) // first change of param
        varTable.push({name: name, value: value});
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
        }
    });
}

function isLocalVariable(node, params) {
    return node.type === 'Identifier' && !params.includes(astToCode(node));
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

function generateBindings(params, args, varTable) {
    let bindings = {};
    for (let i = 0 ; i < params.length; i++) {
        let found = false;
        for (let j = 0; j < varTable.length; j++)
            if (params[i] === varTable[j].name) { // param has changed/updated
                bindings[params[i]] = varTable[j].value;
                found = true;
                break;
            }
        if(!found) // param has not changed/updated
            bindings[params[i]] = args[i];
    }
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
                let value = bindings[astToCode(node)], b = true; // b is for lint only
                while(b)
                    try {
                        value = tryEvalValue(value);
                        break;
                    }
                    catch(error) {
                        if(bindings[value] !== undefined)
                            value = bindings[value];
                        else break;
                    }
                return parseCode(JSON.stringify(value)).body[0].expression;
            }
        }
    });
}

function tryEvalValue(value) {
    if(eval(value) !== undefined)
        return eval(value);
    return value;
}

export {parseCode, astToCode, symbolicSubstitution, initVarTable};