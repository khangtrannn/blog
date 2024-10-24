import {
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  Injectable,
  OnInit,
  Renderer2,
} from '@angular/core';
import { formatJs } from './prettier';
import { NgControl } from '@angular/forms';
import { ContentEditorService } from './content-editor.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const TYPESCRIPT_REGEX = /```typescript[\s\S]*?```/g;

@Directive({
  selector: '[appContentEditor]',
  standalone: true,
  exportAs: 'contentEditor',
})
export class ContentEditorDirective implements OnInit {
  #ngControl = inject(NgControl);
  #elementRef = inject<ElementRef<HTMLTextAreaElement>>(ElementRef);
  #contentEditorService = inject(ContentEditorService);
  #render = inject(Renderer2);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault();
      this.#formatCode();
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.#contentEditorService.setUnsavedChanges(true);
      this.#handleIndentContent();
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      this.#contentEditorService.setUnsavedChanges(true);
      this.handleTab();
    }
  }

  ngOnInit(): void {
    this.#render.listen(this.#element, 'input', () => {
      this.#contentEditorService.setUnsavedChanges(true);
    });
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

  async #formatCode() {
    try {
      const cursorPosition = this.#element.selectionStart;
      const content = this.#ngControl.value;
      const typescriptCodeBlocks = content.match(TYPESCRIPT_REGEX);
      let formattedContent = content;

      for (const codeBlock of typescriptCodeBlocks!) {
        const code = codeBlock.match(/```typescript\s*([\s\S]*?)```/)![1];
        const formattedCode = await formatJs(code);
        formattedContent = formattedContent.replace(code, formattedCode);
      }

      if (formattedContent !== content) {
        this.#ngControl.control?.setValue(formattedContent);
        this.#contentEditorService.setUnsavedChanges(true);
        this.#setCursorPosition(cursorPosition);
      }
    } catch (error) {
      console.error('Error formatting code:', error);
    }
  }

  #setCursorPosition(position: number) {
    setTimeout(() => {
      this.#element.selectionStart = this.#element.selectionEnd = position;
    });
  }
}
