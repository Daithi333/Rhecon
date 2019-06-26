import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.component.html',
  styleUrls: ['./join-group.component.scss'],
})
export class JoinGroupComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  constructor(
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      joiningCode: new FormControl(null)
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'joinGroup');
  }

  onSubmitCode() {

  }

}
