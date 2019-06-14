import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap, take } from 'rxjs/operators';

import { Attachment } from './attachment.model';

@Injectable({
  providedIn: 'root'
})
export class AttachmentsService {
  private _attachments = new BehaviorSubject<Attachment[]>([]);

  constructor(private httpClient: HttpClient) {}

  get attachments() {
    return this._attachments.asObservable();
  }

  fetchAttachments(requestId: number) {
    return this.httpClient.get<{[key: number]: Attachment}>(
      `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/attachment/read.php?requestId=${requestId}`
    )
    .pipe(
      map(resData => {
        // console.log(resData);
        const attachments = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            attachments.push(
              resData[key].attachmentUrl
            );
          }
        }
        return attachments;
      }),
      tap(attachments => {
        this._attachments.next(attachments);
      })
    );
  }

  addAttachment(requestId: number, attachmentUrl: string) {
    let uniqueId: number;
    const newAttachment = {
      id: null,
      requestId,
      attachmentUrl
    };
    return this.httpClient.post<{dbId: number}>('http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/attachment/create.php',
      { ...newAttachment }
    )
    .pipe(
      switchMap(responseData => {
        uniqueId = responseData.dbId;
        return this.attachments;
      }),
      take(1),
      tap(attachments => {
        newAttachment.id = uniqueId;
        this._attachments.next(attachments.concat(newAttachment));
      })
    );
  }

  addAttachmentFile(attachmentFile: File) {
    const attachmentData = new FormData();
    attachmentData.append('fileUpload', attachmentFile);

    return this.httpClient.post<{fileUrl: string, filePath: string}>(
      'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/file/attachment_upload.php',
      attachmentData
    );
  }

  deleteAttachment(attachmentId: number) {
    return this.httpClient.delete(
      `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/attachment/delete.php/?id=${attachmentId}`
    )
    .pipe(
      switchMap(() => {
        return this.attachments;
      }),
      take(1),
      tap(requests => {
        this._attachments.next(requests.filter(a => a.id !== attachmentId));
      })
    );
  }

}
