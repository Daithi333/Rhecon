import { Component, OnInit, Input } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';

import { GroupsService } from '../../groups.service';

@Component({
  selector: 'app-email-invitation',
  templateUrl: './email-invitation.component.html',
  styleUrls: ['./email-invitation.component.scss'],
})
export class EmailInvitationComponent implements OnInit {
  form: FormGroup;
  @Input() groupId;
  subject = '';
  body = '';
  recipient = '';

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private groupsService: GroupsService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null)
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
      message: 'Preparing email'
    }).then(loadingEl => {
      loadingEl.present();
      this.groupsService.addInvitation(
        this.groupId,
        this.form.value.email
      ).subscribe(() => {
        loadingEl.dismiss();
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

}
