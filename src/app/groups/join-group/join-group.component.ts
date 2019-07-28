import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';

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
      inviteCode: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(50)]
      })
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'joinGroup');
  }

  onSubmitCode() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Verifying code...'
    }).then(loadingEl => {
      loadingEl.present();
      console.log(this.form.value.inviteCode);
      return this.groupsService.joinWithCode(
        this.form.value.inviteCode
      )
      .subscribe(() => {
        loadingEl.dismiss();
        this.presentAlert();
        this.onClose();
      },
      error => {
        const $errorMsg = this.determineError(error.error.message);
        let $header = 'Unsuccessful';
        if (error.error.message === 'Invalidation unsuccessful') {
          // process worked but code failed to be invalidated in DB
          $header = 'Success!';
        }
        loadingEl.dismiss();
        this.alertController.create({
          header: $header,
          message: $errorMsg,
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

  private determineError(error: string) {
    switch (error) {
      case 'Code not found':
        return 'The code entered is invalid';
      case 'Code is no longer valid':
        return 'The code is no longer valid';
      case 'Code has expired':
        return 'The code has expired';
      case 'Member not Added':
        return 'Could not add you to the group, please try again later.';
      case 'Invalidation unsuccessful':
        return 'You have successfully joined the group';
      default:
        return 'There was a problem verifying the code';
    }
  }
}
