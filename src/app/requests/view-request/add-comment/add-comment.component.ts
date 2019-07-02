import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit {
  form: FormGroup;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      comment: new FormControl(null)
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'addComment');
  }

  onSubmitComment() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Adding comment..'
    }).then(loadingEl => {
      loadingEl.present();
    });
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Comment Added',
      message: 'Comment has been added to the request',
      buttons: ['OK']
    });
    await alert.present();
  }

}
