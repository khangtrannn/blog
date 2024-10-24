import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContentEditorService {
  #unsavedChanged = signal(false);
  unsavedChanges = this.#unsavedChanged.asReadonly();

  setUnsavedChanges(value: boolean) {
    this.#unsavedChanged.set(value);
  }
}
