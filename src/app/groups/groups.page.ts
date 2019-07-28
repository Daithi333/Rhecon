import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController, ModalController, IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

import { Group } from './group-model';
import { GroupsService } from './groups.service';
import { JoinGroupComponent } from './join-group/join-group.component';
import { GroupSearchComponent } from './group-search/group-search.component';

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
    this.groupsSub = this.groupsService.groups
      .subscribe(groups => {
        this.groups = groups;
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.groupsService.fetchGroupsWithMembers().subscribe(() => {
      this.isLoading = false;
    });
  }

  onCreateGroup() {
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

  onGroupSearch() {
    this.modalController.create({
      component: GroupSearchComponent,
      id: 'groupSearch'
    })
    .then(modalEl => {
      modalEl.present();
    });
  }

  onJoinGroup() {
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

  // confirm before calling delete group. Only works if user is only member
  onDeleteGroup(groupId: number, slidingItem: IonItemSliding) {
    const group = this.groups.find(g => g.id === groupId);
    if (group.members.length > 1) {
      this.presentDeleteRejection();
      slidingItem.close();
      return;
    }
    this.alertController.create({
      header: 'Confirm action',
      message: 'Are you sure you wish to delete this group?',
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

  private presentDeleteRejection() {
    this.alertController.create({
      header: 'Unable to delete',
      message: 'A group with members cannot be deleted. You can leave after assigning a new admin from the Edit Group page.',
      buttons: ['Okay']
    }).then(alertEl => {
      alertEl.present();
    });
  }

}
