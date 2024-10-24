import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import { ContentEditorDirective } from '../../../core/content-editor.directive';
import { ContentEditorService } from '../../../core/content-editor.service';
import { SvgIconComponent } from 'angular-svg-icon';
import { RouterLink } from '@angular/router';

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
  imports: [
    MarkdownComponent,
    FormsModule,
    ContentEditorDirective,
    SvgIconComponent,
    RouterLink,
  ],
  templateUrl: './content-editor.component.html',
  styleUrl: './content-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentEditorComponent {
  #contentEditorService = inject(ContentEditorService);

  title = model.required<string>();
  content = model.required<string>();
  unsavedChanges = this.#contentEditorService.unsavedChanges;

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
