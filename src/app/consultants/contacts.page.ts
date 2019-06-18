import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Contact } from './contact.model';
import { ContactsService } from './contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit, OnDestroy {
  isLoading = false;
  contacts: Contact[];
  contactsSub: Subscription;

  constructor(private contactsService: ContactsService) { }

  ngOnInit() {
    this.contactsSub = this.contactsService.contacts.subscribe(contacts => {
      this.contacts = contacts;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.contactsService.fetchContacts().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.contactsSub) {
      this.contactsSub.unsubscribe();
    }
  }

}
