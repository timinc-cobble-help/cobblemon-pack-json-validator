function isValidJSON(jsonString) {
    function skipWhitespace() {
        while (i < jsonString.length && /\s/.test(jsonString[i])) {
            i++;
        }
    }

    function parseNull() {
        if (jsonString.substr(i, 4) === "null") {
            i += 4;
            return null;
        }
        throw new SyntaxError("Unexpected token at position " + i);
    }

    function parseBoolean() {
        if (jsonString.substr(i, 4) === "true") {
            i += 4;
            return true;
        } else if (jsonString.substr(i, 5) === "false") {
            i += 5;
            return false;
        }
        throw new SyntaxError("Unexpected token at position " + i);
    }

    function parseNumber() {
        const start = i;
        if (jsonString[i] === '-') i++;
        while (i < jsonString.length && /[0-9]/.test(jsonString[i])) i++;
        if (jsonString[i] === '.') {
            i++;
            while (i < jsonString.length && /[0-9]/.test(jsonString[i])) i++;
        }
        if (jsonString[i] === 'e' || jsonString[i] === 'E') {
            i++;
            if (jsonString[i] === '+' || jsonString[i] === '-') i++;
            while (i < jsonString.length && /[0-9]/.test(jsonString[i])) i++;
        }
        const numberString = jsonString.slice(start, i);
        const numberValue = Number(numberString);
        if (isNaN(numberValue)) {
            throw new SyntaxError("Unexpected token at position " + i);
        }
        return numberValue;
    }

    function parseString() {
        if (jsonString[i] !== '"') {
            throw new SyntaxError("Unexpected token at position " + i);
        }
        i++;
        let result = "";
        while (i < jsonString.length) {
            const ch = jsonString[i++];
            if (ch === '"') {
                return result;
            }
            if (ch === '\\') {
                const escapeChar = jsonString[i++];
                switch (escapeChar) {
                    case '"':
                    case '\\':
                    case '/':
                        result += escapeChar;
                        break;
                    case 'b':
                        result += '\b';
                        break;
                    case 'f':
                        result += '\f';
                        break;
                    case 'n':
                        result += '\n';
                        break;
                    case 'r':
                        result += '\r';
                        break;
                    case 't':
                        result += '\t';
                        break;
                    case 'u':
                        // eslint-disable-next-line no-case-declarations
                        const hex = jsonString.substr(i, 4);
                        if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
                            throw new SyntaxError("Unexpected token at position " + i);
                        }
                        result += String.fromCharCode(parseInt(hex, 16));
                        i += 4;
                        break;
                    default:
                        throw new SyntaxError("Unexpected token at position " + i);
                }
            } else {
                result += ch;
            }
        }
        throw new SyntaxError("Unexpected token at position " + i);
    }

    function parseArray() {
        if (jsonString[i] !== '[') {
            throw new SyntaxError("Unexpected token at position " + i);
        }
        i++;
        const result = [];
        skipWhitespace();
        if (jsonString[i] === ']') {
            i++;
            return result;
        }
        while (i < jsonString.length) {
            result.push(parseValue());
            skipWhitespace();
            if (jsonString[i] === ']') {
                i++;
                return result;
            }
            if (jsonString[i] !== ',') {
                throw new SyntaxError("Unexpected token at position " + i);
            }
            i++;
            skipWhitespace();
        }
        throw new SyntaxError("Unexpected token at position " + i);
    }

    function parseObject() {
        if (jsonString[i] !== '{') {
            throw new SyntaxError("Unexpected token at position " + i);
        }
        i++;
        const result = {};
        skipWhitespace();
        if (jsonString[i] === '}') {
            i++;
            return result;
        }
        while (i < jsonString.length) {
            const key = parseString();
            skipWhitespace();
            if (jsonString[i] !== ':') {
                throw new SyntaxError("Unexpected token at position " + i);
            }
            i++;
            const value = parseValue();
            result[key] = value;
            skipWhitespace();
            if (jsonString[i] === '}') {
                i++;
                return result;
            }
            if (jsonString[i] !== ',') {
                throw new SyntaxError("Unexpected token at position " + i);
            }
            i++;
            skipWhitespace();
        }
        throw new SyntaxError("Unexpected token at position " + i);
    }

    function parseValue() {
        skipWhitespace();
        if (jsonString[i] === '{') {
            return parseObject();
        } else if (jsonString[i] === '[') {
            return parseArray();
        } else if (jsonString[i] === '"') {
            return parseString();
        } else if (jsonString[i] === 'n') {
            return parseNull();
        } else if (jsonString[i] === 't' || jsonString[i] === 'f') {
            return parseBoolean();
        } else if (jsonString[i] === '-' || /[0-9]/.test(jsonString[i])) {
            return parseNumber();
        }
        throw new SyntaxError("Unexpected token at position " + i);
    }

    let i = 0;
    const output = parseValue();
    skipWhitespace();
    if (i !== jsonString.length) {
        throw new SyntaxError("Unexpected token at position " + i);
    }
    console.log(output);
}

export default isValidJSON