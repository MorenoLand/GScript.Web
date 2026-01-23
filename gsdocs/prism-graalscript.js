(function(Prism) {
  'use strict';
  
  Prism.languages.graalscript = {
    'comment': [
      {
        pattern: /^\s*#.*$/m,
        greedy: true
      },
      {
        pattern: /\/\/.*$/,
        greedy: true
      },
      {
        pattern: /\/\*[\s\S]*?\*\//,
        greedy: true
      }
    ],
    'string': {
      pattern: /"(?:[^"\\]|\\.)*"/,
      greedy: true
    },
    'variable': {
      pattern: /\$[a-zA-Z_][a-zA-Z0-9_]*(?:::[a-zA-Z_][a-zA-Z0-9_]*)*/,
      greedy: true
    },
    'number': /\b(?:[0-9]+|0[xX][0-9a-fA-F]+)\b/,
    'keyword': {
      pattern: /\b(?:break|case|continue|default|do|else|elseif|for|if|in|return|switch|while|with|join|leave|public|private|const|enum|function|new|datablock|true|false|nil|null|NULL|pi|timevar2|this|thiso|temp|server|serverr|client|clientr|player|name)\b/,
      greedy: true
    },
    'function': {
      pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*\s*(?=\()/,
      greedy: true
    },
    'operator': /[-~^@\/%|=+*!?&<>\[\]{}();:,.]/,
    'punctuation': /[{}();:,.]/
  };
})(typeof Prism !== 'undefined' ? Prism : (typeof window !== 'undefined' ? window.Prism : {}));
