import { ChangeDetectionStrategy, Component, computed, effect, model, signal, untracked } from '@angular/core';
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
  post = model.required<Post>();

  title = signal('');
  content = signal(''); 

  compiledMarkdown = computed(() => {
    return md.render(this.post().content);
  });

  #initializedData = effect(() => {
    const post = this.post();
    untracked(() => {
      this.title.set(post.title);
      this.content.set(post.content);
    });
  });

  #syncChanges = effect(() => {
    const title = this.title();
    const content = this.content();

    untracked(() => {
      this.post.update((post) => ({ ...post, title, content }));
    });
  });
}
