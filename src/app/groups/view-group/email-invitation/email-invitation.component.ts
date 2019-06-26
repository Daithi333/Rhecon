import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-email-invitation',
  templateUrl: './email-invitation.component.html',
  styleUrls: ['./email-invitation.component.scss'],
})
export class EmailInvitationComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  constructor(
    private modalController: ModalController
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

  }

}
