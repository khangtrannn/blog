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

    create(post: Post) {
        return this.#http.post<{ id: string }>(POSTS_URL, { title: post.title, content: post.content });
    }

    update(post: Post) {
        return this.#http.put(`${POSTS_URL}/${post.id}`, { title: post.title, content: post.content });
    }

    getById(id: string) {
        return this.#http.get<Post>(`${POSTS_URL}/${id}`);
    }

    getAll() {
        return this.#http.get<Post[]>(POSTS_URL);
    }
}