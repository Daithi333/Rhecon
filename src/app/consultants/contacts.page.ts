import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { User } from './user.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit, OnDestroy {
  users: User[];
  usersSub: Subscription;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.usersSub = this.usersService.users.subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy() {
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }
  }

}
