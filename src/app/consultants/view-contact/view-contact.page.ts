import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { User } from '../user.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.page.html',
  styleUrls: ['./view-contact.page.scss'],
})
export class ViewContactPage implements OnInit, OnDestroy {
  consultant: User;
  consultantSub: Subscription;

  constructor(private usersService: UsersService,
              private route: ActivatedRoute,
              private navController: NavController) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('contactId')) {
        this.navController.navigateBack('/tabs/consultants');
        return;
      }
      this.consultantSub = this.usersService.getUser(+paramMap.get('contactId'))
        .subscribe(consultant => {
          this.consultant = consultant;
        });
    });
  }

  ngOnDestroy() {
    if (this.consultantSub) {
      this.consultantSub.unsubscribe();
    }
  }
}
