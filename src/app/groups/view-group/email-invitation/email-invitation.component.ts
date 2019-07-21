import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { GroupsService } from '../../groups.service';

@Component({
  selector: 'app-email-invitation',
  templateUrl: './email-invitation.component.html',
  styleUrls: ['./email-invitation.component.scss'],
})
export class EmailInvitationComponent implements OnInit {
  form: FormGroup;
  @Input() groupId;
  @Input() groupName;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private groupsService: GroupsService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      })
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'emailInvitation');
  }

  onSendInvite() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Sending email...'
    }).then(loadingEl => {
      loadingEl.present();
      this.groupsService.addInvitation(
        this.groupName,
        this.groupId,
        this.form.value.email
      ).subscribe(() => {
        loadingEl.dismiss();
        this.presentAlert();
        this.onClose();
      },
      error => {
        console.log(error);
        loadingEl.dismiss();
        this.alertController.create({
          header: 'Error',
          message: 'There was a problem preparing the email, please try again later',
          buttons: ['Okay']
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Email Sent',
      message: `Invitation has been sent to ${this.form.value.email}.`,
      buttons: ['OK']
    });
    await alert.present();
  }

}
