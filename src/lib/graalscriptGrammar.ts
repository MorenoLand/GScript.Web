// Prism language module for GraalScript 2 (GS2), faithfully translated from the
// project's TextMate grammar (tmLanguage). Prism language modules are functions
// that attach a grammar object to Prism.languages, which is the shape
// react-syntax-highlighter's registerLanguage expects. Token class names are
// chosen so the shipped oneDark theme colours them (comment/string/number/
// keyword/constant/function/operator/punctuation). See CodeBlock.tsx.

graalscript.displayName = 'graalscript'
graalscript.aliases = ['gs2', 'gscript2', 'graal', 'graalscript2', 'gs1', 'gscript']

export function graalscript(Prism: any) {
  Prism.languages.graalscript = {
    comment: [
      { pattern: /\/\/[^\n\r]*/, greedy: true },
      { pattern: /\/\*\*(?=[^*])[\s\S]*?\*\//, greedy: true },
      { pattern: /\/\*(?!\*)[\s\S]*?\*\//, greedy: true },
    ],
    string: {
      pattern: /"(?:\\.|[^"\\\r\n])*"/,
      greedy: true,
      inside: {
        keyword:
          /\b(?:SELECT|INSERT|UPDATE|DELETE|CREATE|TABLE|FROM|WHERE|VALUES|SET|INTO|AND|OR|NOT|NULL|IS|AS|ON|JOIN|LEFT|RIGHT|INNER|OUTER|GROUP|BY|ORDER|LIMIT|OFFSET|DISTINCT|COUNT|AVG|SUM|MIN|MAX|PRIMARY|KEY|DEFAULT|INT|TEXT)\b/,
      },
    },
    number: /\b(?:\d+|0[xX][0-9a-fA-F]+)\b/,
    keyword: {
      pattern:
        /\b(?:break|case|continue|default|do|else|elseif|for|if|in|return|switch|while|with|import|public|private|const|enum|function|new|datablock|this|thiso|temp|server|serverr|client|clientr|player|name)\b/,
    },
    constant: {
      pattern: /\b(?:true|false|nil|null|NULL|pi|timevar2)\b/,
    },
    function: {
      pattern: /[a-zA-Z_]\w*(?=\s*\()/,
    },
    operator: /[-~^@/%|=+*!?&<>]/,
    punctuation: /[{}[\]();:,.]/,
  }
}
