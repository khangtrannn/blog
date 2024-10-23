import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  HostListener,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { Post } from '../../../core/post';

import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';

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
export class ContentEditorComponent {
  title = model.required<string>();
  content = model.required<string>();

  save = output<void>();

  compiledMarkdown = computed(() => {
    return md.render(this.content());
  });

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      this.save.emit();
    }
  }
}
