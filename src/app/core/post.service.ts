import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BASE_URL } from "../app.constants";
import { Post } from "./post";

const POSTS_URL = `${BASE_URL}/posts`;

@Injectable({
    providedIn: 'root',
})
export class PostService {
    #http = inject(HttpClient);

    create(title: string, content: string) {
        return this.#http.post(POSTS_URL, { title, content });
    }

    getAll() {
        return this.#http.get<Post[]>(POSTS_URL);
    }
}