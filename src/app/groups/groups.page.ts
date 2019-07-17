import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController, ModalController, IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

import { Group } from './group-model';
import { GroupsService } from './groups.service';
import { JoinGroupComponent } from './join-group/join-group.component';

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
    private router: Router,
    private modalController: ModalController
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
      header: 'Group Membership',
      message: 'By setting up a group, you will be responsible for inviting and removing members.',
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

  onJoin() {
    this.modalController.create({
      component: JoinGroupComponent,
      id: 'joinGroup'
    })
    .then(modalEl => {
      modalEl.present();
    });
  }

  onLeaveGroup(groupId: number, slidingItem: IonItemSliding) {
    this.alertController.create({
      header: 'Confirm action',
      message: 'Are you sure you wish to leave this group?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.groupsService.leaveGroup(groupId).subscribe(() => {
              slidingItem.close();
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            slidingItem.close();
        }
      }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  onDeleteGroup(groupId: number, slidingItem: IonItemSliding) {
    this.alertController.create({
      header: 'Confirm action',
      message: 'Are you sure you wish to disband this group?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.groupsService.deleteGroup(groupId).subscribe(() => {
              slidingItem.close();
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            slidingItem.close();
        }
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
