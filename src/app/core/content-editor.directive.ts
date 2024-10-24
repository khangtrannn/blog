import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Injectable,
  OnInit,
} from '@angular/core';
import { formatJs } from './prettier';
import { NgControl } from '@angular/forms';

const TYPESCRIPT_REGEX = /```typescript[\s\S]*?```/g;

@Directive({
  selector: '[contentEditor]',
  standalone: true,
})
export class ContentEditorDirective {
  #ngControl = inject(NgControl);
  #elementRef = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault();
      this.#formatCode();
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.#handleIndentContent();
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      this.handleTab();
    }
  }

  get #element() {
    return this.#elementRef.nativeElement;
  }

  get #content() {
    return this.#ngControl.value;
  }

  private handleTab(): void {
    const cursorPosition = this.#element.selectionStart;
    this.#ngControl.control?.setValue(
      this.#content.substring(0, cursorPosition) +
        '\t' +
        this.#content.substring(cursorPosition),
    );
    this.#setCursorPosition(cursorPosition + 1);
  }

  async #handleIndentContent() {
    const cursorPosition = this.#element.selectionStart;
    const beforeCursor = this.#content.substring(0, cursorPosition);
    const currentLine = beforeCursor.split('\n').pop() || '';

    const afterCursor = this.#content.substring(cursorPosition);
    const nextLine = afterCursor.split('\n')[1] || '';

    const currentIndent = currentLine.match(/^\s*/)?.[0] || '';
    const nextLineIndent = nextLine.match(/^\s*/)?.[0] || '';

    const indent =
      currentIndent.length > nextLineIndent.length
        ? currentIndent
        : nextLineIndent;

    this.#ngControl.control?.setValue(
      `${beforeCursor}\n${indent}${afterCursor}`,
    );
    this.#setCursorPosition(cursorPosition + indent.length + 1);
  }

  #setCursorPosition(position: number) {
    setTimeout(() => {
      this.#element.selectionStart = this.#element.selectionEnd = position;
    });
  }

  async #formatCode() {
    try {
      const content = this.#ngControl.value;
      const typescriptCodeBlocks = content.match(TYPESCRIPT_REGEX);
      let formattedContent = content;

      for (const codeBlock of typescriptCodeBlocks!) {
        const code = codeBlock.match(/```typescript\s*([\s\S]*?)```/)![1];
        const formattedCode = await formatJs(code);
        formattedContent = formattedContent.replace(code, formattedCode);
      }

      this.#ngControl.control?.setValue(formattedContent);
    } catch (error) {
      console.error('Error formatting code:', error);
    }
  }
}
