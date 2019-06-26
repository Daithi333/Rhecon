import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { Group } from './group-model';
import { GroupsService } from './groups.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit, OnDestroy {
  isLoading = false;
  groups: Group[] = [];
  private groupsSub: Subscription;

  constructor(
    private groupsService: GroupsService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.groupsSub = this.groupsService.groups.subscribe(groups => {
      this.groups = groups;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.groupsService.fetchGroupsWithMembers().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCreate() {
    this.alertController.create({
      header: 'Managing a group',
      message: 'If you choose to setup a new group, you will be responsible for adding and removing its members.',
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.router.navigateByUrl('/groups/new-group');
          }
        },
        {
          text: 'Back'
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
    if (this.groupsSub) {
      this.groupsSub.unsubscribe();
    }
  }

}
