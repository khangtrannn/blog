import parserHtml from 'prettier/plugins/html';
import * as prettier from 'prettier/standalone';
import * as parserBabel from 'prettier/plugins/babel.js';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import * as parserTypescript from 'prettier/parser-typescript';

export async function formatJs(code: string): Promise<string> {
  return prettier.format(code, {
    parser: 'typescript',
    plugins: [parserHtml, parserBabel, parserTypescript, prettierPluginEstree],
    singleQuote: true,
  });
}

export async function formatAngularTemplate(template: string): Promise<string> {
  return prettier.format(template, {
    parser: 'angular',
    plugins: [parserHtml],
  });
}
