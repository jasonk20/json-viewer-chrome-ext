let lexer = moo.compile({
  number: {
    match: /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/,
    value: (x) => isNumber(x),
  },
  string: {
    match: /"(?:\\["\\rn]|[^"\\])*?"/,
    value: (x) => isString(x),
    lineBreaks: true,
  },
  lbrace: { match: "{", value: (x) => isLBrace(x) },
  rbrace: { match: "}", value: (x) => isRBrace(x) },
  lbrack: { match: "[", value: (x) => isLBrack(x) },
  rbrack: { match: "]", value: (x) => isRBrack(x) },
  null: { match: "null", value: (x) => isNull(x) },
  boolean: { match: /true|false/, value: (x) => isBoolean(x) },
  comma: { match: ",", value: (x) => isComma(x) },
  colon: { match: ":", value: (x) => isColon(x) },
  WS: /[ \t]+/,
  NL: { match: /\n/, lineBreaks: true },
});

function isNumber(data) {
  return `<span class="number">${data}</span>`;
}
function isLink(data) {
  return `<a href=${data} target="_blank" rel="noreferrer noopener">${data}</a>`;
}
function isString(data) {
  if (
    /"(?:https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))+?"/.test(
      data
    )
  ) {
    return isLink(data);
  }
  return `<span class="string">${data}</span>`;
}
function isLBrace(data) {
  return `<span class="brace">${data}</span><div style="margin-left: 1rem">`;
}
function isRBrace(data) {
  return `</div><span class="brace">${data}</span>`;
}
function isComma(data) {
  return `<span class="comma">${data}</span>`;
}
function isColon(data) {
  return `<span class="colon">${data}</span>`;
}
function isLBrack(data) {
  return `<span class="brack lbrack">${data}</span>`;
}
function isRBrack(data) {
  return `<span class="brack rbrack">${data}</span>`;
}
function isBoolean(data) {
  return `<span class="boolean">${data}</span>`;
}
function isNull(data) {
  return `<span class="null">${data}</span>`;
}

function jsonParser(lexer) {
  lexer.reset(pre.innerHTML);

  let arr = [],
    tokens = Array.from(lexer).filter(
      (x) => x.type !== "NL" && x.type !== "WS"
    ),
    len = tokens.length - 1;

  tokens.forEach((t, indx) => {
    let str = "";
    if (
      t.type === "comma" &&
      ((indx >= 2 && tokens[indx - 2].type === "colon") ||
        (indx >= 1 &&
          (tokens[indx - 1].type === "rbrace" ||
            tokens[indx - 1].type === "rbrack")))
    ) {
      str = `${t.value}<br/>`;
    } else {
      if (indx !== len && tokens[indx + 1].type === "colon") {
        str = `<span class="key">${t.text}</span>`;
      } else {
        str = t.value;
      }
    }
    arr.push(str);
  });

  return arr;
}

const pre = document.querySelector("pre"),
  body = document.querySelector("body"),
  div = document.createElement("div");

let html = jsonParser(lexer).reduce((acc = "", token) => acc + token);

body.removeChild(pre);

body.appendChild(div);
div.innerHTML = html;
