import assert from 'assert';
import {parseCode, symbolicSubstitution, initVarTable} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('first test', () => {
        let parsedCode = parseCode(`function foo(x, y, z){
    let a = x + 1;
    let b = a + y;
    let c = 0;

    if (b < z) {
        c = c + 5;
        return x + y + z + c;
    } else if (b < z * 2) {
        c = c + x + 5;
        return x + y + z + c;
    } else {
        c = c + z + 5;
        return x + y + z + c;
    }
}
`);
        let parsedArgs = parseCode('1,2,3');
        let expected = '{"function":{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}}},"params":[{"type":"Identifier","name":"x","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":14}}},{"type":"Identifier","name":"y","loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":17}}},{"type":"Identifier","name":"z","loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":20}}}],"body":{"type":"BlockStatement","body":[{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x","loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9}}},"right":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":13}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":13}}},"right":{"type":"Identifier","name":"y","loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":17}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":17}}},"right":{"type":"Identifier","name":"z","loc":{"start":{"line":2,"column":20},"end":{"line":2,"column":21}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":21}}},"consequent":{"type":"BlockStatement","body":[{"type":"ReturnStatement","argument":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x","loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":16}}},"right":{"type":"Identifier","name":"y","loc":{"start":{"line":3,"column":19},"end":{"line":3,"column":20}}},"loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":20}}},"right":{"type":"Identifier","name":"z","loc":{"start":{"line":3,"column":23},"end":{"line":3,"column":24}}},"loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":24}}},"right":{"type":"Literal","value":0,"raw":"0","loc":{"start":{"line":3,"column":27},"end":{"line":3,"column":28}}},"loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":28}}},"right":{"type":"Literal","value":5,"raw":"5","loc":{"start":{"line":3,"column":31},"end":{"line":3,"column":32}}},"loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":32}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":33}}}],"loc":{"start":{"line":2,"column":23},"end":{"line":4,"column":5}}},"alternate":{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x","loc":{"start":{"line":4,"column":15},"end":{"line":4,"column":16}}},"right":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":4,"column":19},"end":{"line":4,"column":20}}},"loc":{"start":{"line":4,"column":15},"end":{"line":4,"column":20}}},"right":{"type":"Identifier","name":"y","loc":{"start":{"line":4,"column":23},"end":{"line":4,"column":24}}},"loc":{"start":{"line":4,"column":15},"end":{"line":4,"column":24}}},"right":{"type":"BinaryExpression","operator":"*","left":{"type":"Identifier","name":"z","loc":{"start":{"line":4,"column":27},"end":{"line":4,"column":28}}},"right":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":4,"column":31},"end":{"line":4,"column":32}}},"loc":{"start":{"line":4,"column":27},"end":{"line":4,"column":32}}},"loc":{"start":{"line":4,"column":15},"end":{"line":4,"column":32}}},"consequent":{"type":"BlockStatement","body":[{"type":"ReturnStatement","argument":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x","loc":{"start":{"line":5,"column":15},"end":{"line":5,"column":16}}},"right":{"type":"Identifier","name":"y","loc":{"start":{"line":5,"column":19},"end":{"line":5,"column":20}}},"loc":{"start":{"line":5,"column":15},"end":{"line":5,"column":20}}},"right":{"type":"Identifier","name":"z","loc":{"start":{"line":5,"column":23},"end":{"line":5,"column":24}}},"loc":{"start":{"line":5,"column":15},"end":{"line":5,"column":24}}},"right":{"type":"Literal","value":0,"raw":"0","loc":{"start":{"line":5,"column":27},"end":{"line":5,"column":28}}},"loc":{"start":{"line":5,"column":15},"end":{"line":5,"column":28}}},"right":{"type":"Identifier","name":"x","loc":{"start":{"line":5,"column":31},"end":{"line":5,"column":32}}},"loc":{"start":{"line":5,"column":15},"end":{"line":5,"column":32}}},"right":{"type":"Literal","value":5,"raw":"5","loc":{"start":{"line":5,"column":35},"end":{"line":5,"column":36}}},"loc":{"start":{"line":5,"column":15},"end":{"line":5,"column":36}}},"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":37}}}],"loc":{"start":{"line":4,"column":34},"end":{"line":6,"column":5}}},"alternate":{"type":"BlockStatement","body":[{"type":"ReturnStatement","argument":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x","loc":{"start":{"line":7,"column":15},"end":{"line":7,"column":16}}},"right":{"type":"Identifier","name":"y","loc":{"start":{"line":7,"column":19},"end":{"line":7,"column":20}}},"loc":{"start":{"line":7,"column":15},"end":{"line":7,"column":20}}},"right":{"type":"Identifier","name":"z","loc":{"start":{"line":7,"column":23},"end":{"line":7,"column":24}}},"loc":{"start":{"line":7,"column":15},"end":{"line":7,"column":24}}},"right":{"type":"Literal","value":0,"raw":"0","loc":{"start":{"line":7,"column":27},"end":{"line":7,"column":28}}},"loc":{"start":{"line":7,"column":15},"end":{"line":7,"column":28}}},"right":{"type":"Identifier","name":"z","loc":{"start":{"line":7,"column":31},"end":{"line":7,"column":32}}},"loc":{"start":{"line":7,"column":15},"end":{"line":7,"column":32}}},"right":{"type":"Literal","value":5,"raw":"5","loc":{"start":{"line":7,"column":35},"end":{"line":7,"column":36}}},"loc":{"start":{"line":7,"column":15},"end":{"line":7,"column":36}}},"loc":{"start":{"line":7,"column":8},"end":{"line":7,"column":37}}}],"loc":{"start":{"line":6,"column":11},"end":{"line":8,"column":5}}},"loc":{"start":{"line":4,"column":11},"end":{"line":8,"column":5}}},"loc":{"start":{"line":2,"column":4},"end":{"line":8,"column":5}}}],"loc":{"start":{"line":1,"column":22},"end":{"line":9,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":9,"column":1}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":9,"column":1}}},"linesColorsArray":[{"line":2,"color":"red"},{"line":4,"color":"chartreuse"}]}';
        assert(JSON.stringify(symbolicSubstitution(parsedCode,parsedArgs)) === expected);
    });

    it('global vars test only one arg', () => {
        let parsedCode = parseCode(`
    function foo(x){
    let a = x + 1;
    if (a < 3) {
        return x;
    }
}
`);
        let parsedArgs = parseCode('1');
        let expected = '{"function":{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}}},"params":[{"type":"Identifier","name":"x","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":14}}}],"body":{"type":"BlockStatement","body":[{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x","loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9}}},"right":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":13}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":13}}},"right":{"type":"Literal","value":3,"raw":"3","loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":17}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":17}}},"consequent":{"type":"BlockStatement","body":[{"type":"ReturnStatement","argument":{"type":"Identifier","name":"x","loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":16}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":17}}}],"loc":{"start":{"line":2,"column":19},"end":{"line":4,"column":5}}},"alternate":null,"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":5}}}],"loc":{"start":{"line":1,"column":16},"end":{"line":5,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":5,"column":1}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":5,"column":1}}},"linesColorsArray":[{"line":2,"color":"chartreuse"}]}';
        assert(JSON.stringify(symbolicSubstitution(parsedCode,parsedArgs)) === expected);

    });


    it('global vars test', () => {
        let parsedCode = parseCode(`
    let w = 9;
    function foo(x, y, z){
    let a = x + 1;
    let b = a + y;
    let c = 0;

    if (b < z) {
        c = c + 5;
        return x + y + z + c;
    } else if (b < z * 2) {
        c = c + x + 5;
        return x + y + z + c;
    } else {
        c = c + z + 5;
        return x + y + z + c;
    }
}
let q = 99;
`);
        let t1 = initVarTable(parsedCode);
        assert(JSON.stringify(t1) === '[{"name":"w","value":"9"},{"name":"q","value":"99"}]');
    });



    it('while test', () => {
        let parsedCode = parseCode(`
    function foo(x){
    let a = x + 1;
    while (a < 100) {
        x = x + 1;       
     } 
}
`);
        let parsedArgs = parseCode('1');
        let expected = '{"function":{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}}},"params":[{"type":"Identifier","name":"x","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":14}}}],"body":{"type":"BlockStatement","body":[{"type":"WhileStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x","loc":{"start":{"line":2,"column":11},"end":{"line":2,"column":12}}},"right":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":2,"column":15},"end":{"line":2,"column":16}}},"loc":{"start":{"line":2,"column":11},"end":{"line":2,"column":16}}},"right":{"type":"Literal","value":100,"raw":"100","loc":{"start":{"line":2,"column":19},"end":{"line":2,"column":22}}},"loc":{"start":{"line":2,"column":11},"end":{"line":2,"column":22}}},"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"x","loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":9}}},"right":{"type":"BinaryExpression","operator":"+","left":{"type":"Identifier","name":"x","loc":{"start":{"line":3,"column":12},"end":{"line":3,"column":13}}},"right":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":3,"column":16},"end":{"line":3,"column":17}}},"loc":{"start":{"line":3,"column":12},"end":{"line":3,"column":17}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":17}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":18}}}],"loc":{"start":{"line":2,"column":24},"end":{"line":4,"column":5}}},"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":5}}}],"loc":{"start":{"line":1,"column":16},"end":{"line":5,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":5,"column":1}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":5,"column":1}}},"linesColorsArray":[]}';
        assert(JSON.stringify(symbolicSubstitution(parsedCode,parsedArgs)) === expected);
    });


    it('global vars test with assignment', () => {
        let parsedCode = parseCode(`
    let w = 9;
    function foo(x, y, z){
    let a = x + 1;
    let b = a + y;
    let c = 0;

    if (b < z) {
        c = c + 5;
        return x + y + z + c;
    } else if (b < z * 2) {
        c = c + x + 5;
        return x + y + z + c;
    } else {
        c = c + z + 5;
        return x + y + z + c;
    }
}
let q = 99;
q=10;
`);
        let t1 = initVarTable(parsedCode);
        assert(JSON.stringify(t1) === '[{"name":"w","value":"9"},{"name":"q","value":"10"}]');
    });


    it('undefined init vars', () => {
        let parsedCode = parseCode(`function foo(x, y, z){
    let r;
    r = 5;
    if(r<10) {
        return 1;
    }
    return 2;
}`);
        let parsedArgs = parseCode('1,2,3');
        let expected = '{"function":{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}}},"params":[{"type":"Identifier","name":"x","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":14}}},{"type":"Identifier","name":"y","loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":17}}},{"type":"Identifier","name":"z","loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":20}}}],"body":{"type":"BlockStatement","body":[{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Literal","value":5,"raw":"5","loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9}}},"right":{"type":"Literal","value":10,"raw":"10","loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":14}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":14}}},"consequent":{"type":"BlockStatement","body":[{"type":"ReturnStatement","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":16}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":17}}}],"loc":{"start":{"line":2,"column":16},"end":{"line":4,"column":5}}},"alternate":null,"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":5}}},{"type":"ReturnStatement","argument":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":5,"column":11},"end":{"line":5,"column":12}}},"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":13}}}],"loc":{"start":{"line":1,"column":22},"end":{"line":6,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":6,"column":1}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":6,"column":1}}},"linesColorsArray":[{"line":2,"color":"chartreuse"}]}';
        assert(JSON.stringify(symbolicSubstitution(parsedCode,parsedArgs)) === expected);
    });

    it('substituteArrayAssignmentExpressionHandler test', () => {
        let parsedCode = parseCode(`function foo(x, y, z){
    let r = [1, 2 , 3];
    r[0] = 77;
    if(r[0]<10) {
        return 1;
    }
    return 2;
}`);
        let parsedArgs = parseCode('1,2,3');
        let expected = '{"function":{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}}},"params":[{"type":"Identifier","name":"x","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":14}}},{"type":"Identifier","name":"y","loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":17}}},{"type":"Identifier","name":"z","loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":20}}}],"body":{"type":"BlockStatement","body":[{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"MemberExpression","computed":true,"object":{"type":"ArrayExpression","elements":[{"type":"Literal","value":77,"raw":"77","loc":{"start":{"line":2,"column":9},"end":{"line":2,"column":11}}},{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":14}}},{"type":"Literal","value":3,"raw":"3","loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":17}}}],"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":18}}},"property":{"type":"Literal","value":0,"raw":"0","loc":{"start":{"line":2,"column":19},"end":{"line":2,"column":20}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":21}}},"right":{"type":"Literal","value":10,"raw":"10","loc":{"start":{"line":2,"column":24},"end":{"line":2,"column":26}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":26}}},"consequent":{"type":"BlockStatement","body":[{"type":"ReturnStatement","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":16}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":17}}}],"loc":{"start":{"line":2,"column":28},"end":{"line":4,"column":5}}},"alternate":null,"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":5}}},{"type":"ReturnStatement","argument":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":5,"column":11},"end":{"line":5,"column":12}}},"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":13}}}],"loc":{"start":{"line":1,"column":22},"end":{"line":6,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":6,"column":1}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":6,"column":1}}},"linesColorsArray":[{"line":2,"color":"red"}]}';
        assert(JSON.stringify(symbolicSubstitution(parsedCode,parsedArgs)) === expected);
    });

    it('multi replace test', () => {
        let parsedCode = parseCode(`function foo(x, y, z){
    let r = z;
    let c = r;
    if(c<10) {
        return 1;
    }
    return 2;
}`);
        let parsedArgs = parseCode('1,2,3');
        let expected = '{"function":{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}}},"params":[{"type":"Identifier","name":"x","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":14}}},{"type":"Identifier","name":"y","loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":17}}},{"type":"Identifier","name":"z","loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":20}}}],"body":{"type":"BlockStatement","body":[{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Identifier","name":"z","loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9}}},"right":{"type":"Literal","value":10,"raw":"10","loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":14}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":14}}},"consequent":{"type":"BlockStatement","body":[{"type":"ReturnStatement","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":16}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":17}}}],"loc":{"start":{"line":2,"column":16},"end":{"line":4,"column":5}}},"alternate":null,"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":5}}},{"type":"ReturnStatement","argument":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":5,"column":11},"end":{"line":5,"column":12}}},"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":13}}}],"loc":{"start":{"line":1,"column":22},"end":{"line":6,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":6,"column":1}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":6,"column":1}}},"linesColorsArray":[{"line":2,"color":"chartreuse"}]}';
        assert(JSON.stringify(symbolicSubstitution(parsedCode,parsedArgs)) === expected);
    });

    it('assignment to param with param test', () => {
        let parsedCode = parseCode(`function foo(x, y, z){
    let z = x;
    if(z < 10) {
        return 1;
    }
    return 2;
}`);
        let parsedArgs = parseCode('1,2,3');
        let expected = '{"function":{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}}},"params":[{"type":"Identifier","name":"x","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":14}}},{"type":"Identifier","name":"y","loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":17}}},{"type":"Identifier","name":"z","loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":20}}}],"body":{"type":"BlockStatement","body":[{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"<","left":{"type":"Identifier","name":"z","loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9}}},"right":{"type":"Literal","value":10,"raw":"10","loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":14}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":14}}},"consequent":{"type":"BlockStatement","body":[{"type":"ReturnStatement","argument":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":16}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":17}}}],"loc":{"start":{"line":2,"column":16},"end":{"line":4,"column":5}}},"alternate":null,"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":5}}},{"type":"ReturnStatement","argument":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":5,"column":11},"end":{"line":5,"column":12}}},"loc":{"start":{"line":5,"column":4},"end":{"line":5,"column":13}}}],"loc":{"start":{"line":1,"column":22},"end":{"line":6,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":6,"column":1}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":6,"column":1}}},"linesColorsArray":[{"line":2,"color":"chartreuse"}]}';
        assert(JSON.stringify(symbolicSubstitution(parsedCode,parsedArgs)) === expected);
    });

    it('expression statement but not assignment test', () => {
        let parsedCode = parseCode(`function foo(x, y, z){
    x;
    return 2;
}`);
        let parsedArgs = parseCode('1,2,3');
        let expected = '{"function":{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}}},"params":[{"type":"Identifier","name":"x","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":14}}},{"type":"Identifier","name":"y","loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":17}}},{"type":"Identifier","name":"z","loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":20}}}],"body":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"Identifier","name":"x","loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":5}}},"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":6}}},{"type":"ReturnStatement","argument":{"type":"Literal","value":2,"raw":"2","loc":{"start":{"line":3,"column":11},"end":{"line":3,"column":12}}},"loc":{"start":{"line":3,"column":4},"end":{"line":3,"column":13}}}],"loc":{"start":{"line":1,"column":22},"end":{"line":4,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":4,"column":1}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":4,"column":1}}},"linesColorsArray":[]}';
        assert(JSON.stringify(symbolicSubstitution(parsedCode,parsedArgs)) === expected);
    });

    it('search array in table test', () => {
        let parsedCode = parseCode(`function foo(x, y){
    let array = [1,2,3];
    if (y == 6){
        x = 7;
        return x;
    }
    return y;
}`);
        let parsedArgs = parseCode('1,2,3');
        let expected = '{"function":{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}}},"params":[{"type":"Identifier","name":"x","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":14}}},{"type":"Identifier","name":"y","loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":17}}}],"body":{"type":"BlockStatement","body":[{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"==","left":{"type":"Identifier","name":"y","loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9}}},"right":{"type":"Literal","value":6,"raw":"6","loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":14}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":14}}},"consequent":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"x","loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":9}}},"right":{"type":"Literal","value":7,"raw":"7","loc":{"start":{"line":3,"column":12},"end":{"line":3,"column":13}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":13}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":14}}},{"type":"ReturnStatement","argument":{"type":"Identifier","name":"x","loc":{"start":{"line":4,"column":15},"end":{"line":4,"column":16}}},"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":17}}}],"loc":{"start":{"line":2,"column":16},"end":{"line":5,"column":5}}},"alternate":null,"loc":{"start":{"line":2,"column":4},"end":{"line":5,"column":5}}},{"type":"ReturnStatement","argument":{"type":"Identifier","name":"y","loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":12}}},"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":13}}}],"loc":{"start":{"line":1,"column":19},"end":{"line":7,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":7,"column":1}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":7,"column":1}}},"linesColorsArray":[{"line":2,"color":"red"}]}';
        assert(JSON.stringify(symbolicSubstitution(parsedCode,parsedArgs)) === expected);
    });

    it('search array in table test', () => {
        let parsedCode = parseCode(`let roie;
function foo(x, y){
    if (y == 6){
        x = 7;
        return x;
    }
    return y;
}`);
        let parsedArgs = parseCode('1,2');
        let expected = '{"function":{"type":"Program","body":[{"type":"FunctionDeclaration","id":{"type":"Identifier","name":"foo","loc":{"start":{"line":1,"column":9},"end":{"line":1,"column":12}}},"params":[{"type":"Identifier","name":"x","loc":{"start":{"line":1,"column":13},"end":{"line":1,"column":14}}},{"type":"Identifier","name":"y","loc":{"start":{"line":1,"column":16},"end":{"line":1,"column":17}}}],"body":{"type":"BlockStatement","body":[{"type":"IfStatement","test":{"type":"BinaryExpression","operator":"==","left":{"type":"Identifier","name":"y","loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":9}}},"right":{"type":"Literal","value":6,"raw":"6","loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":14}}},"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":14}}},"consequent":{"type":"BlockStatement","body":[{"type":"ExpressionStatement","expression":{"type":"AssignmentExpression","operator":"=","left":{"type":"Identifier","name":"x","loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":9}}},"right":{"type":"Literal","value":7,"raw":"7","loc":{"start":{"line":3,"column":12},"end":{"line":3,"column":13}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":13}}},"loc":{"start":{"line":3,"column":8},"end":{"line":3,"column":14}}},{"type":"ReturnStatement","argument":{"type":"Identifier","name":"x","loc":{"start":{"line":4,"column":15},"end":{"line":4,"column":16}}},"loc":{"start":{"line":4,"column":8},"end":{"line":4,"column":17}}}],"loc":{"start":{"line":2,"column":16},"end":{"line":5,"column":5}}},"alternate":null,"loc":{"start":{"line":2,"column":4},"end":{"line":5,"column":5}}},{"type":"ReturnStatement","argument":{"type":"Identifier","name":"y","loc":{"start":{"line":6,"column":11},"end":{"line":6,"column":12}}},"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":13}}}],"loc":{"start":{"line":1,"column":19},"end":{"line":7,"column":1}}},"generator":false,"expression":false,"async":false,"loc":{"start":{"line":1,"column":0},"end":{"line":7,"column":1}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":7,"column":1}}},"linesColorsArray":[{"line":2,"color":"red"}]}';
        assert(JSON.stringify(symbolicSubstitution(parsedCode,parsedArgs)) === expected);
    });

});
