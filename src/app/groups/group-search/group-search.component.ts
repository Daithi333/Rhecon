import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';

import { GroupsService } from '../groups.service';
import { GroupSearch } from '../group-search.model';

@Component({
  selector: 'app-group-search',
  templateUrl: './group-search.component.html',
  styleUrls: ['./group-search.component.scss'],
})
export class GroupSearchComponent implements OnInit {
  form: FormGroup;
  groups: GroupSearch[];

  constructor(
    private modalController: ModalController,
    private groupsService: GroupsService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      groupName: new FormControl(null)
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'groupSearch');
  }

  onRequestJoin(groupName: string, adminEmail: string) {
    this.alertController.create({
      header: 'Confirm action',
      message: `Do you want to send a request to join ${groupName}?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.groupsService.requestJoin(groupName, adminEmail).subscribe(() => {
              this.presentAlert();
            });
          }
        },
        {
          text: 'No',
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Searching for groups...'
    }).then(loadingEl => {
      loadingEl.present();
      return this.groupsService.groupSearchWithAdmin(
        this.form.value.groupName
      )
      .subscribe(groups => {
        this.groups = groups;
        loadingEl.dismiss();
      });
    });
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Request Sent',
      message: 'Your request to join has been emailed to the group admin.',
      buttons: ['OK']
    });
    await alert.present();
  }

}
