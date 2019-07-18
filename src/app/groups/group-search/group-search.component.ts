import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalController, LoadingController } from '@ionic/angular';

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
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      groupName: new FormControl(null)
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'groupSearch');
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

}
