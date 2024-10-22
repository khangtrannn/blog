import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BASE_URL } from "../app.constants";

@Injectable({
    providedIn: 'root',
})
export class PostService {
    #http = inject(HttpClient);

    create(title: string, content: string) {
        return this.#http.post(`${BASE_URL}/posts`, { title, content });
    }
}