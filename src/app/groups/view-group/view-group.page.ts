import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController, IonItemSliding, ActionSheetController, ModalController } from '@ionic/angular';
import { take, switchMap } from 'rxjs/operators';

import { Group } from '../group-model';
import { GroupsService } from '../groups.service';
import { EmailInvitationComponent } from './email-invitation/email-invitation.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.page.html',
  styleUrls: ['./view-group.page.scss'],
})
export class ViewGroupPage implements OnInit, OnDestroy {
  group: Group;
  userId: number;
  groupId: number;
  isLoading = false;
  editMode = false;
  private groupSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private alertController: AlertController,
    private groupsService: GroupsService,
    private router: Router,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupId')) {
        this.navController.navigateBack('/groups');
        return;
      }
      this.groupId = +paramMap.get('groupId');
      this.isLoading = true;
      this.groupSub = this.authService.userId.pipe(
        take(1),
        switchMap(userId => {
          this.userId = userId;
          if (!userId) {
            throw new Error('User not found!');
          }
          return this.groupsService.getGroup(+paramMap.get('groupId'));
        })
      )
      .subscribe(group => {
        this.group = group;
        this.editMode = this.group.isAdmin;
        this.isLoading = false;
      },
      error => {
        this.alertController.create({
          header: 'Error',
          message: 'Could not locate group information.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/groups']);
              }
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  onInviteMember() {
    this.actionSheetController.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Invite by email',
          handler: () => {
            this.openEmailModal();
          }
        },
        // {
        //   text: 'Invite by text',
        //   handler: () => {
        //   }
        // },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  openEmailModal() {
    this.modalController.create({
      component: EmailInvitationComponent,
      componentProps: {
        groupName: this.group.groupName,
        groupId: this.group.id
      },
      id: 'emailInvitation'
    })
    .then(modalEl => {
      modalEl.present();
    });
  }

  // when user wants to hand over admin priviliges
  onChangeAdmin(newAdminId: number, slidingItem: IonItemSliding) {
    const newAdmin = this.group.members.find(m => m.id === newAdminId);
    this.alertController.create({
      header: 'Confirm Admin Change',
      message: `Are you sure you wish to make ${newAdmin.firstName}
                ${newAdmin.lastName} the new admin for ${this.group.groupName}?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.groupsService.changeAdmin(this.group.id, newAdminId).subscribe(() => {
              this.editMode = false;
              this.presentAlert();
              slidingItem.close();
              this.router.navigate(['/groups']);
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

  // when admin wants to remove a group member
  onRemoveMember(memberId: number, slidingItem: IonItemSliding) {
    this.alertController.create({
      header: 'Confirm removal',
      message: `Are you sure you wish to remove this member from ${this.group.groupName}?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.groupsService.removeMember(this.group.id, memberId).subscribe(() => {
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

  // when member wants to leave a group
  onLeaveGroup(slidingItem: IonItemSliding) {
    this.alertController.create({
      header: 'Confirm action',
      message: 'Are you sure you wish to leave this group?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.groupsService.leaveGroup(this.group.id).subscribe(() => {
              this.router.navigateByUrl('/groups');
            });
          }
        },
        {
          text: 'No'
      }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
    if (this.groupSub) {
      this.groupSub.unsubscribe();
    }
  }

  private presentAlert() {
    this.alertController.create({
      header: 'Success',
      message: 'Admin successfully changed',
      buttons: [
        {
          text: 'Okay',
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

}
