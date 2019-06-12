import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

interface AttachmentData {
  id: number;
  requestId: number;
  attachmentUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttachmentsService {
  private _attachments = new BehaviorSubject<string[]>(
    [
      'https://mymodernmet.com/wp/wp-content/uploads/2018/10/Mou-Aysha-portrait-photography-3.jpg',
      'https://mymodernmet.com/wp/wp-content/uploads/2018/10/Mou-Aysha-portrait-photography-3.jpg'
    ]
  );

  constructor(private httpClient: HttpClient) { }

  // returns the locally stored list of attachments
  get attachments() {
    return this._attachments.asObservable();
  }

  fetchAttachments(requestId: number) {
    return this.httpClient.get<{[key: number]: AttachmentData}>(
      `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/attachment/read.php?requestId=${requestId}`
    )
    .pipe(
      map(resData => {
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

}
