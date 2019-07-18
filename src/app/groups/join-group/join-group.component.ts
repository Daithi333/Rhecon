import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
        let $errorMsg = 'There was a problem verifying the code';
        let $header = 'ErrorInvalid Code';
        switch (error.error.message) {
          case 'Code not found':
            $errorMsg = 'Code entered in invalid';
            break;
          case 'Code is no longer valid':
            $errorMsg = 'Code is no longer valid';
            break;
          case 'Code has expired':
            $errorMsg = 'Code has expired';
            break;
          case 'Member not Added':
            $errorMsg = 'Could not add you to the group, please try again later.';
            break;
          case 'Invalidation unsuccessful':
            $header = 'Success!';
            $errorMsg = 'You have successfully joined the group';
            // TODO - joining code failed to be invalidated in DB.
            break;
          default:
            break;
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
}
