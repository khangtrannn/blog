import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  model,
  OnDestroy,
  OnInit,
  output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';

import { RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import { ContentEditorDirective } from '../../../core/content-editor.directive';
import { ContentEditorService } from '../../../core/content-editor.service';

const md = new MarkdownIt({
  highlight: (str: string, lang: string, _attrs: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch (err) { }
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
export class ContentEditorComponent implements OnInit, OnDestroy {
  #contentEditorService = inject(ContentEditorService);

  title = model.required<string>();
  content = model.required<string>();
  unsavedChanges = this.#contentEditorService.unsavedChanges;

  save = output<void>();

  compiledMarkdown = computed(() => {
    return md.render(this.content());
  });

  ngOnInit() {
    window.addEventListener('beforeunload', this.unloadNotification.bind(this));
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.unloadNotification.bind(this));
  }

  unloadNotification(event: BeforeUnloadEvent) {
    if (this.unsavedChanges()) {
      event.preventDefault();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      this.save.emit();
    }
  }
}
