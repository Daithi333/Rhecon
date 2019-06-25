import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-email-invitation',
  templateUrl: './email-invitation.component.html',
  styleUrls: ['./email-invitation.component.scss'],
})
export class EmailInvitationComponent implements OnInit {
  isLoading = false;

  constructor(
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'emailInvitation');
  }

  onSendInvite() {

  }

}
