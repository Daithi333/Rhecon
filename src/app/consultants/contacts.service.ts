import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Contact } from './contact.model';
import { Specialism } from './specialism.enum';
import { AuthService } from '../auth/auth.service';

interface ContactData {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  specialism: Specialism;
  portraitUrl: string;
  bio: string;
  groups: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private _contacts = new BehaviorSubject<Contact[]>([]);

  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  get contacts() {
    return this._contacts.asObservable();
  }

  fetchContacts() {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return this.httpClient.get<{[key: number]: ContactData}>(
          `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/contact/read.php?userId=${userId}`
        );
      }),
      map(resData => {
        const contacts = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            contacts.push(
              new Contact(
                resData[key].id,
                resData[key].title,
                resData[key].firstName,
                resData[key].lastName,
                resData[key].specialism,
                resData[key].portraitUrl,
                resData[key].bio,
                []
              )
            );
          }
        }
        return contacts;
      }),
      tap(contacts => {
        this._contacts.next(contacts);
      })
    );
  }

  getContact(id: number) {
    return this.httpClient.get<ContactData>(
      `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/contact/read_single.php?id=${id}`
    )
    .pipe(
      map(contactData => {
        return new Contact(
          id,
          contactData.title,
          contactData.firstName,
          contactData.lastName,
          contactData.specialism,
          contactData.portraitUrl,
          contactData.bio,
          []
        );
      })
    );
  }

}
