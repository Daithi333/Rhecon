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

  /**
   * Retrieve attachment urls from database for a particular request and update local list
   * @param requestId - unique id of the request
   */
  fetchAttachments(requestId: number) {
    return this.httpClient.get<{[key: number]: Attachment}>(
      `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/attachment/read.php?requestId=${requestId}`
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

  /**
   * retrieve an attachment record based on request it belongs to and its url (for deleting it from request)
   * @param requestId - unique request id
   * @param attachmentUrl - the attachment url on server
   */
  getAttachment(requestId: number, attachmentUrl: string) {
    return this.httpClient.get<Attachment>(
      `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/attachment/read_single.php?
      requestId=${requestId}&attachmentUrl=${attachmentUrl}`
    )
    .pipe(
      map(attachmentData => {
        return new Attachment(
          +attachmentData.id,
          requestId,
          attachmentUrl
        );
      })
    );
  }

  // Add new attachment record to db and local list
  addAttachment(requestId: number, attachmentUrl: string) {
    let uniqueId: number;
    const newAttachment = {
      id: null,
      requestId,
      attachmentUrl
    };
    return this.httpClient.post<{dbId: number}>('http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/attachment/create.php',
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

  // delete attachment from DB and local list
  deleteAttachment(attachmentId: number) {
    return this.httpClient.delete(
      `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/attachment/delete.php/?id=${attachmentId}`
    )
    .pipe(
      switchMap(() => {
        return this.attachments;
      }),
      take(1),
      tap(attachments => {
        this._attachments.next(attachments.filter(a => a.id !== attachmentId));
      })
    );
  }

  // upload attahment file to server
  addAttachmentFile(attachmentFile: File) {
    const attachmentData = new FormData();
    attachmentData.append('fileUpload', attachmentFile);

    return this.httpClient.post<{fileUrl: string, filePath: string, message?: string}>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/file/attachment_upload.php',
      attachmentData
    );
  }

  // download attachemnt file from server
  downloadAttachment(fileUrl: string) {
    return this.httpClient.post(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/file/attachment_download.php',
      { fileUrl },
      {observe: 'response', responseType: 'blob'}
    );
  }

}
