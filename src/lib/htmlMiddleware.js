import Prism from 'prismjs';
import "prismjs/components/prism-bash";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-sass";
import "prismjs/components/prism-scss";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-graphql";

import { parse, getCodeCaption, findAll, serialize } from '../lib/domUtil';

const filePathRegex = /([(A-Z)|(a-z)|\/|\.])+\.([a-z])+/;

const alias = {
  bash: { grammer: Prism.languages.bash, language: 'bash' },
  tsx: { grammer: Prism.languages.tsx, language: 'tsx' },
  ts: { grammer: Prism.languages.ts, language: 'typescript' },
  js: { grammer: Prism.languages.js, language: 'javascript' },
  jsx: { grammer: Prism.languages.jsx, language: 'jsx' },
  json: { grammer: Prism.languages.json, language: 'json' },
  html: { grammer: Prism.languages.html, language: 'html' },
  css: { grammer: Prism.languages.css, language: 'css-extras' },
  sass: { grammer: Prism.languages.sass, language: 'sass' },
  scss: { grammer: Prism.languages.scss, language: 'scss' },
  md: { grammer: Prism.languages.md, language: 'md' },
  graphql: { grammer: Prism.languages.graphql, language: 'graphql' },
  'env': { grammer: Prism.languages.bash, language: 'bash' },
}

const findLanguageExtenstion = (text) => {
  const result = text.match(filePathRegex);
  const filePath = result ? result[0] : '';
  const token = filePath.split('.');
  if(token.length > 0) {
    const extension = token[token.length - 1];
    return extension || 'bash';
  } else {
    return 'bash';
  }
}

const highlighteCode = (codeBlock, extension) => {
  const codeContent = codeBlock.childNodes.find(el => el.tagName === 'code').childNodes[0];
  if(!alias[extension]) {
    throw new Error(`Unsupported extension : ${extension}`);
  }
  const { grammer, language } =  alias[extension];
  const codeHtml = Prism.highlight(codeContent.value, grammer, language);
  const code = parse(codeHtml);
  codeBlock.childNodes = code.childNodes;
  codeBlock.attrs = [{ name: 'class', value: `language-${language}`}];
  codeContent.attrs = [{ name: 'class', value: `language-${language}`}];
}

const htmlMiddleware = (html) => {
  const DOM = parse(html);
  const codeBlocks = findAll(DOM.childNodes, (el) => el.tagName === 'pre');
  
  codeBlocks.forEach(codeBlock => {
    try {
      const { parentNode } = codeBlock;
      if(parentNode && parentNode.tagName === 'li') {
        const caption = getCodeCaption(parentNode);
        const extension = findLanguageExtenstion(caption);
        highlighteCode(codeBlock, extension);
      } else {
        highlighteCode(codeBlock, 'bash');
      }
    } catch(error) {
      console.error(error);
    }
  });
  
  return serialize(DOM);
}

export default htmlMiddleware;

const SupportedLanges = {
  Markup: "markup, html, xml, svg, mathml",
  CSS: "css",
  "C-like": "clike",
  JavaScript: "javascript, js",
  ABAP: "abap",
  "Augmented Backus–Naur form": "abnf",
  ActionScript: "actionscript",
  Ada: "ada",
  "Apache Configuration": "apacheconf",
  APL: "apl",
  AppleScript: "applescript",
  Arduino: "arduino",
  ARFF: "arff",
  AsciiDoc: "asciidoc, adoc",
  "6502 Assembly": "asm6502",
  "ASP.NET (C#)": "aspnet",
  AutoHotkey: "autohotkey",
  AutoIt: "autoit",
  Bash: "bash, shell",
  BASIC: "basic",
  Batch: "batch",
  Bison: "bison",
  "Backus–Naur form": "bnf, rbnf",
  Brainfuck: "brainfuck",
  Bro: "bro",
  C: "c",
  "C#": "csharp, dotnet",
  "C++": "cpp",
  CIL: "cil",
  CoffeeScript: "coffeescript, coffee",
  CMake: "cmake",
  Clojure: "clojure",
  Crystal: "crystal",
  "Content-Security-Policy": "csp",
  "CSS Extras": "css-extras",
  D: "d",
  Dart: "dart",
  Diff: "diff",
  "Django/Jinja2": "django, jinja2",
  Docker: "docker, dockerfile",
  "Extended Backus–Naur form": "ebnf",
  Eiffel: "eiffel",
  EJS: "ejs",
  Elixir: "elixir",
  Elm: "elm",
  ERB: "erb",
  Erlang: "erlang",
  "F#": "fsharp",
  Flow: "flow",
  Fortran: "fortran",
  "G-code": "gcode",
  GEDCOM: "gedcom",
  Gherkin: "gherkin",
  Git: "git",
  GLSL: "glsl",
  "GameMaker Language": "gml, gamemakerlanguage",
  Go: "go",
  GraphQL: "graphql",
  Groovy: "groovy",
  Haml: "haml",
  Handlebars: "handlebars",
  Haskell: "haskell, hs",
  Haxe: "haxe",
  HCL: "hcl",
  HTTP: "http",
  "HTTP Public-Key-Pins": "hpkp",
  "HTTP Strict-Transport-Security": "hsts",
  IchigoJam: "ichigojam",
  Icon: "icon",
  "Inform 7": "inform7",
  Ini: "ini",
  Io: "io",
  J: "j",
  Java: "java",
  JavaDoc: "javadoc",
  "JavaDoc-like": "javadoclike",
  "Java stack trace": "javastacktrace",
  Jolie: "jolie",
  JSDoc: "jsdoc",
  "JS Extras": "js-extras",
  JSON: "json",
  JSONP: "jsonp",
  JSON5: "json5",
  Julia: "julia",
  Keyman: "keyman",
  Kotlin: "kotlin",
  LaTeX: "latex",
  Less: "less",
  Liquid: "liquid",
  Lisp: "lisp, emacs, elisp, emacs-lisp",
  LiveScript: "livescript",
  LOLCODE: "lolcode",
  Lua: "lua",
  Makefile: "makefile",
  Markdown: "markdown, md",
  "Markup templating": "markup-templating",
  MATLAB: "matlab",
  MEL: "mel",
  Mizar: "mizar",
  Monkey: "monkey",
  N1QL: "n1ql",
  N4JS: "n4js, n4jsd",
  "Nand To Tetris HDL": "nand2tetris-hdl",
  NASM: "nasm",
  nginx: "nginx",
  Nim: "nim",
  Nix: "nix",
  NSIS: "nsis",
  "Objective-C": "objectivec",
  OCaml: "ocaml",
  OpenCL: "opencl",
  Oz: "oz",
  "PARI/GP": "parigp",
  Parser: "parser",
  Pascal: "pascal, objectpascal",
  Perl: "perl",
  PHP: "php",
  PHPDoc: "phpdoc",
  "PHP Extras": "php-extras",
  "PL/SQL": "plsql",
  PowerShell: "powershell",
  Processing: "processing",
  Prolog: "prolog",
  ".properties": "properties",
  "Protocol Buffers": "protobuf",
  Pug: "pug",
  Puppet: "puppet",
  Pure: "pure",
  Python: "python, py",
  "Q (kdb+ database)": "q",
  Qore: "qore",
  R: "r",
  "React JSX": "jsx",
  "React TSX": "tsx",
  "Ren'py": "renpy",
  Reason: "reason",
  Regex: "regex",
  "reST (reStructuredText)": "rest",
  Rip: "rip",
  Roboconf: "roboconf",
  Ruby: "ruby, rb",
  Rust: "rust",
  SAS: "sas",
  "Sass (Sass)": "sass",
  "Sass (Scss)": "scss",
  Scala: "scala",
  Scheme: "scheme",
  Smalltalk: "smalltalk",
  Smarty: "smarty",
  SQL: "sql",
  "Soy (Closure Template)": "soy",
  Stylus: "stylus",
  Swift: "swift",
  TAP: "tap",
  Tcl: "tcl",
  Textile: "textile",
  TOML: "toml",
  "Template Toolkit 2": "tt2",
  Twig: "twig",
  TypeScript: "typescript, ts",
  "T4 Text Templates (C#)": "t4-cs, t4",
  "T4 Text Templates (VB)": "t4-vb",
  "T4 templating": "t4-templating",
  Vala: "vala",
  "VB.Net": "vbnet",
  Velocity: "velocity",
  Verilog: "verilog",
  VHDL: "vhdl",
  vim: "vim",
  "Visual Basic": "visual-basic, vb",
  WebAssembly: "wasm",
  "Wiki markup": "wiki",
  Xeora: "xeora, xeoracube",
  "Xojo (REALbasic)": "xojo",
  XQuery: "xquery",
  YAML: "yaml, yml",
}

