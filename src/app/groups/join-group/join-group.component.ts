import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';

import { switchMap, take } from 'rxjs/operators';
import { GroupsService } from '../groups.service';

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.component.html',
  styleUrls: ['./join-group.component.scss'],
})
export class JoinGroupComponent implements OnInit {
  form: FormGroup;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private groupsService: GroupsService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      inviteCode: new FormControl(null)
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'joinGroup');
  }

  onSubmitCode() {
    if (!this.form.valid) {
      return;
    }
    let invitationId;
    this.loadingController.create({
      message: 'Verifying code...'
    }).then(loadingEl => {
      loadingEl.present();
      this.groupsService.verifyInvitation(
        this.form.value.inviteCode
      ).pipe(
        take(1),
        switchMap(resData => {
          invitationId = +resData.id;
          return this.groupsService.addMembership(+resData.groupId);
        }),
        take(1),
        switchMap(memberData => {
          return this.groupsService.invalidateInvitation(invitationId);
        }),
        take(1),
      )
      .subscribe(() => {
        loadingEl.dismiss();
        this.presentAlert();
        this.onClose();
      },
      error => {
        console.log(error);
        loadingEl.dismiss();
        this.alertController.create({
          header: 'Error',
          message: 'There was a problem verifying the request, please try again later',
          buttons: ['Okay']
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Success!',
      message: 'You have successfully joined the group',
      buttons: ['OK']
    });
    await alert.present();
  }
}
