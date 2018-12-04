import assert from 'assert';
import {extract, parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert(
            JSON.stringify(extract(parseCode(''))) === JSON.stringify([])
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert(
            JSON.stringify(extract(parseCode('let a = 1;'))) === '[{"line":1,"type":"variable declaration","name":"a","condition":"","value":1}]'
        );
    });

    it('FunctionDeclaration test', () => {
        assert(
            JSON.stringify(extract(parseCode('function f(){}'))) === '[{"line":1,"type":"function declaration","name":"f","condition":"","value":""}]'
        );
    });

    it('Identifier test', () => {
        assert(
            JSON.stringify(extract(parseCode('x'))) === '[{"line":1,"type":"identifier","name":"x","condition":"","value":""}]'
        );
    });

    it('BlockStatement test', () => {
        assert(
            JSON.stringify(extract(parseCode(`{
            let a = 1;
            }`))) === '[{"line":2,"type":"variable declaration","name":"a","condition":"","value":1}]'
        );
    });

    it('ReturnStatement test', () => {
        assert(
            JSON.stringify(extract(parseCode(`function f(){ 
            return result;
            }`))) ===
            '[{"line":1,"type":"function declaration","name":"f","condition":"","value":""},{"line":2,"type":"return statement","name":"","condition":"","value":"result"}]'
        );
    });

    it('BinaryExpression test', () => {
        assert(
            JSON.stringify(extract(parseCode('1+2;'))) ===
            '["1 + 2"]'
        );
    });

    it('Literal test', () => {
        assert(
            JSON.stringify(extract(parseCode('5'))) ===
            '[{"line":1,"type":"literal","name":"","condition":"","value":5}]'
        );
    });

    it('IfStatement test', () => {
        assert(
            JSON.stringify(extract(parseCode(` if (x<4)
             y = x - 1;`))) ===
            '[{"line":1,"type":"if statement","name":"","condition":"x < 4","value":""},{"line":2,"type":"assignment expression","name":"y","condition":"","value":"x - 1"}]'
        );
    });

    it('else if test', () => {
        assert(
            JSON.stringify(extract(parseCode('function f(x){\n' +
                'if(x<6)\n' +
                'y=1;\n' +
                'else if (x>10)\n' +
                'y=7;\n' +
                'return x++;\n' +
                '}'))) ===
            '[{"line":1,"type":"function declaration","name":"f","condition":"","value":""},' +
            '{"line":1,"type":"variable declaration","name":"x","condition":"","value":""},' +
            '{"line":2,"type":"if statement","name":"","condition":"x < 6","value":""},' +
            '{"line":3,"type":"assignment expression","name":"y","condition":"","value":1},' +
            '{"line":4,"type":"else if statement","name":"","condition":"x > 10","value":""},' +
            '{"line":5,"type":"assignment expression","name":"y","condition":"","value":7},' +
            '{"line":6,"type":"return statement","name":"","condition":"","value":"x++"}]'
        );
    });

    it('else test', () => {
        assert(
            JSON.stringify(extract(parseCode('function f(x){\n' +
                'if(x<6)\n' +
                'y=1;\n' +
                'else (x>10)\n' +
                'y=7;\n' +
                'return x++;\n' +
                '}'))) ===
            '[{"line":1,"type":"function declaration","name":"f","condition":"","value":""},' +
            '{"line":1,"type":"variable declaration","name":"x","condition":"","value":""},' +
            '{"line":2,"type":"if statement","name":"","condition":"x < 6","value":""},' +
            '{"line":3,"type":"assignment expression","name":"y","condition":"","value":1},"x > 10",' +
            '{"line":5,"type":"assignment expression","name":"y","condition":"","value":7},' +
            '{"line":6,"type":"return statement","name":"","condition":"","value":"x++"}]'
        );
    });

    it('WhileStatement test', () => {
        assert(
            JSON.stringify(extract(parseCode(` while (x<4){
                y = x - 1;
                x++;
                }`))) ===
            '[{"line":1,"type":"while statement","name":"","condition":"x < 4","value":""},' +
            '{"line":2,"type":"assignment expression","name":"y","condition":"","value":"x - 1"},' +
            '{"line":3,"type":"update expression","name":"x","condition":"","value":"x++"}]'
        );
    });

    it('ExpressionStatement test', () => {
        assert(
            JSON.stringify(extract(parseCode('x=7;'))) ===
            '[{"line":1,"type":"assignment expression","name":"x","condition":"","value":7}]'
        );
    });

    it('VariableDeclaration test', () => {
        assert(
            JSON.stringify(extract(parseCode('let x = 7;'))) ===
            '[{"line":1,"type":"variable declaration","name":"x","condition":"","value":7}]'
        );
    });

    it('VariableDeclarator test', () => {
        assert(
            JSON.stringify(extract(parseCode('function func(x,y){\n' +
                '    let a,b;\n' +
                'a=1;\n' +
                'b=2;\n' +
                'return a+b+x+y;\n' +
                '}'))) ===
            '[{"line":1,"type":"function declaration","name":"func","condition":"","value":""},' +
            '{"line":1,"type":"variable declaration","name":"x","condition":"","value":""},' +
            '{"line":1,"type":"variable declaration","name":"y","condition":"","value":""},' +
            '{"line":2,"type":"variable declaration","name":"a","condition":"","value":null},' +
            '{"line":2,"type":"variable declaration","name":"b","condition":"","value":null},' +
            '{"line":3,"type":"assignment expression","name":"a","condition":"","value":1},' +
            '{"line":4,"type":"assignment expression","name":"b","condition":"","value":2},' +
            '{"line":5,"type":"return statement","name":"","condition":"","value":"a + b + x + y"}]'
        );
    });

    it('AssignmentExpression test', () => {
        assert(
            JSON.stringify(extract(parseCode('x=9;'))) ===
            '[{"line":1,"type":"assignment expression","name":"x","condition":"","value":9}]'
        );
    });

    it('UnaryExpression test', () => {
        assert(
            JSON.stringify(extract(parseCode('-y'))) ===
            '[{"line":1,"type":"unary expression","name":"","condition":"","value":"-y"}]'
        );
    });

    it('unaryExpressionToString test', () => {
        assert(
            JSON.stringify(extract(parseCode('let y = -7;'))) ===
            '[{"line":1,"type":"variable declaration","name":"y","condition":"","value":"-7"}]'
        );
    });

    it('MemberExpression with [] test', () => {
        assert(
            JSON.stringify(extract(parseCode('arr[index];'))) ===
            '[{"line":1,"type":"member expression","name":"","condition":"","value":"arr[index]"}]'
        );
    });

    it('MemberExpression array.length test', () => {
        assert(
            JSON.stringify(extract(parseCode('array.length;'))) ===
            '[{"line":1,"type":"member expression","name":"","condition":"","value":"array.length"}]'
        );
    });

    it('UpdateExpression test', () => {
        assert(
            JSON.stringify(extract(parseCode('x++'))) ===
            '[{"line":1,"type":"update expression","name":"x","condition":"","value":"x++"}]'
        );
    });

    it('UpdateExpression with prefix test', () => {
        assert(
            JSON.stringify(extract(parseCode('++i'))) ===
            '[{"line":1,"type":"update expression","name":"i","condition":"","value":"++i"}]'
        );
    });

    it('ForStatement test', () => {
        assert(
            JSON.stringify(extract(parseCode('for (let i = 0 ; i< counter ; i++){\n' +
                '   arr[i]++;\n' +
                '}'))) ===
            '[{"line":1,"type":"for statement","name":"","condition":"i=0; i < counter; i++","value":""},' +
            '{"line":2,"type":"update expression","name":"arr[i]","condition":"","value":"arr[i]++"}]'
        );
    });

    it('SequenceExpression test', () => {
        assert(
            JSON.stringify(extract(parseCode('let x,y; x=6,y=10;'))) ===
            '[{"line":1,"type":"variable declaration","name":"x","condition":"","value":null},' +
            '{"line":1,"type":"variable declaration","name":"y","condition":"","value":null},' +
            '{"line":1,"type":"assignment expression","name":"x","condition":"","value":6},' +
            '{"line":1,"type":"assignment expression","name":"y","condition":"","value":10}]'
        );
    });

    it('SequenceExpression test', () => {
        assert(
            JSON.stringify(extract(parseCode('x && y;'))) ===
            '["x && y"]'
        );
    });

    it('simple callExpression test', () => {
        assert(
            JSON.stringify(extract(parseCode('let x = foo(y);'))) ===
            '[{"line":1,"type":"variable declaration","name":"x","condition":"","value":"foo(y)"}]'
        );
    });

    it('void callExpression test', () => {
        assert(
            JSON.stringify(extract(parseCode('fact(5);'))) ===
            '[{"line":1,"type":"call expression","name":"","condition":"","value":"fact(5)"}]'
        );
    });

    it('few args callExpression test', () => {
        assert(
            JSON.stringify(extract(parseCode('func(x,y,z);'))) ===
            '[{"line":1,"type":"call expression","name":"","condition":"","value":"func(x, y, z)"}]'
        );
    });

    it('not exit type test', () => {
        assert(JSON.stringify(extract(parseCode('{type : \'blabla\'}'))) === JSON.stringify([null])
        );
    });

});
