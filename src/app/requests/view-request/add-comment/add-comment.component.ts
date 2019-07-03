import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';

import { CommentsService } from '../comments.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
})
export class AddCommentComponent implements OnInit {
  form: FormGroup;
  @Input() requestId;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private commentsService: CommentsService
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
      this.commentsService.addComment(
        this.requestId,
        this.form.value.comment
      ).subscribe(() => {
        loadingEl.dismiss();
        this.presentAlert();
        this.onClose();
      });
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
