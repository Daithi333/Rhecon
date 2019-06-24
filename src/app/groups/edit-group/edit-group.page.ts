import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { Group } from '../group-model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController, IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { GroupsService } from '../groups.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.page.html',
  styleUrls: ['./edit-group.page.scss'],
})
export class EditGroupPage implements OnInit, OnDestroy {
  form: FormGroup;
  group: Group;
  groupId: number;
  isLoading = false;
  editMode = false;
  private groupSub: Subscription;
  @ViewChild('fileSelector') fileSelector: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private groupsService: GroupsService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupId')) {
        this.navController.navigateBack('/groups');
        return;
      }
      this.groupId = +paramMap.get('groupId');
      this.isLoading = true;
      this.groupSub = this.groupsService.getGroup(+paramMap.get('groupId'))
        .subscribe(group => {
          this.group = group;
          this.editMode = this.group.isAdmin;
          this.form = new FormGroup({
            groupName: new FormControl(this.group.groupName, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            imageUrl: new FormControl(null)
          });
          this.isLoading = false;
        });
    });
  }

  onSelectImage() {
    this.fileSelector.nativeElement.click();
  }

  onFileChosen(event: Event) {
    const chosenFile = (event.target as HTMLInputElement).files[0];
    if (!chosenFile) {
      // TODO - add alert
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.form.patchValue({ imageUrl: dataUrl});
    };
    fr.readAsDataURL(chosenFile);
  }
  

  onUpdateGroup() {

  }

  onRemove(memberId: number, slidingItem: IonItemSliding) {
    this.alertController.create({
      header: 'Confirm removal',
      message: `Are you sure you wish to remove this member from ${this.group.groupName}?`,
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.groupsService.removeMember(memberId).subscribe(() => {
              slidingItem.close();
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            slidingItem.close();
        }
      }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
    if (this.groupSub) {
      this.groupSub.unsubscribe();
    }
  }
}
