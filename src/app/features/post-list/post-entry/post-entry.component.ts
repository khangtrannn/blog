import { Component, input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { Post } from '../../../core/post';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-entry',
  standalone: true,
  imports: [SvgIconComponent, RouterLink],
  templateUrl: './post-entry.component.html',
  styleUrl: './post-entry.component.scss',
})
export class PostEntryComponent {
  post = input.required<Post>();
}
