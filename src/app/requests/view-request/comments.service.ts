import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap, take } from 'rxjs/operators';

import { Comment } from './comment.model';
import { AuthService } from '../../auth/auth.service';

interface CommentData {
  id: string;
  requestId: string;
  authorId: string;
  comment: string;
  createdOn: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private _comments = new BehaviorSubject<Comment[]>([]);

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  get comments() {
    return this._comments.asObservable();
  }

  fetchComments(requestId: number) {
    return this.httpClient.get<{[key: number]: CommentData}>(
      `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/comment/read.php?requestId=${requestId}`
    )
    .pipe(
      map(resData => {
        // console.log(resData);
        const comments = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            comments.push(
              new Comment(
                +resData[key].id,
                +resData[key].requestId,
                +resData[key].authorId,
                resData[key].comment,
                new Date(resData[key].createdOn)
              )
            );
          }
        }
        return comments;
      }),
      tap(comments => {
        this._comments.next(comments);
      })
    );
  }

  addComment(requestId: number, comment: string) {
    let uniqueId: number;
    let newComment;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        newComment = new Comment(
          null,
          requestId,
          +userId,
          comment,
          null
        );
        return this.httpClient.post<{dbId: number}>('http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/comment/create.php',
          { ...newComment }
        );
      }),
      switchMap(responseData => {
        uniqueId = responseData.dbId;
        return this.comments;
      }),
      take(1),
      tap(comments => {
        newComment.id = uniqueId;
        this._comments.next(comments.concat(newComment));
      })
    );
  }
}