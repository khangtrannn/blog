import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContentEditorService {
  getIndentContent(content: string, cursorPosition: number) {
    const beforeCursor = content.substring(0, cursorPosition);
    const currentLine = beforeCursor.split('\n').pop() || '';

    const afterCursor = content.substring(cursorPosition);
    const nextLine = afterCursor.split('\n')[1] || '';

    const currentIndent = currentLine.match(/^\s*/)?.[0] || '';
    const nextLineIndent = nextLine.match(/^\s*/)?.[0] || '';

    const indent =
      currentIndent.length > nextLineIndent.length
        ? currentIndent
        : nextLineIndent;
    return { indent, content: `${beforeCursor}\n${indent}${afterCursor}` };
  }
}
