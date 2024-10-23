import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  model,
  OnInit,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import { formatJs } from '../../../core/prettier';

const TYPESCRIPT_REGEX = /```typescript[\s\S]*?```/g;

const md = new MarkdownIt({
  highlight: (str: string, lang: string, _attrs: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch (err) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

@Component({
  selector: 'app-content-editor',
  standalone: true,
  imports: [MarkdownComponent, FormsModule],
  templateUrl: './content-editor.component.html',
  styleUrl: './content-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentEditorComponent implements OnInit {
  title = model.required<string>();
  content = model.required<string>();

  save = output<void>();

  contentElementRef =
    viewChild.required<ElementRef<HTMLTextAreaElement>>('contentInput');

  contentElement = computed(() => this.contentElementRef().nativeElement);

  compiledMarkdown = computed(() => {
    return md.render(this.content());
  });

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      this.save.emit();
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
      event.preventDefault();
      this.#formatCode();
    }
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  async #formatCode() {
    try {
      const cursorPosition = this.contentElement().selectionStart;
      const typescriptCodeBlocks = this.content().match(TYPESCRIPT_REGEX);
      let formattedContent = this.content();

      for (const codeBlock of typescriptCodeBlocks!) {
        const code = codeBlock.match(/```typescript\s*([\s\S]*?)```/)![1];
        const formattedCode = await formatJs(code);
        formattedContent = formattedContent.replace(code, formattedCode);
      }

      this.content.set(formattedContent);

      setTimeout(() => {
        this.contentElement().setSelectionRange(cursorPosition, cursorPosition);
      });
    } catch (error) {
      console.error('Error formatting code:', error);
    }
  }
}
