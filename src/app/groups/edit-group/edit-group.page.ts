import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription, iif, defer } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

import { Group } from '../group-model';
import { GroupsService } from '../groups.service';

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
  selectedImage: string;
  private groupSub: Subscription;
  private imageChanged = false;
  @ViewChild('fileSelector') fileSelector: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private groupsService: GroupsService,
    private loadingController: LoadingController,
    private router: Router,
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
          if (!group.isAdmin) {
            this.navController.navigateBack('/groups');
            return;
          }
          this.selectedImage = group.imageUrl;
          this.form = new FormGroup({
            groupName: new FormControl(this.group.groupName, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            imageUrl: new FormControl(this.group.imageUrl)
          });
          this.isLoading = false;
        },
        error => {
          this.alertController.create({
            header: 'Error',
            message: 'Could not locate group information.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/groups']);
                }
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        });
    });
  }

  onSelectImage() {
    this.fileSelector.nativeElement.click();
  }

  // Patch file into form, extracting dataUrl for preview
  onFileChosen(event: Event) {
    this.imageChanged = true;
    const chosenFile = (event.target as HTMLInputElement).files[0];
    if (!chosenFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.form.patchValue({ imageUrl: chosenFile });
    };
    fr.readAsDataURL(chosenFile);
  }

  // Call updateGroup if no image, or addimage first if there is
  onUpdateGroup() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Updating Group'
    }).then(loadingEl => {
      loadingEl.present();
      iif (
        () => !this.imageChanged,
        defer(() => this.callUpdateGroup(this.group.imageUrl)),
        defer(() => this.groupsService.addImage(this.form.get('imageUrl').value).pipe(
          switchMap(resData => {
            if (resData.message) {
              this.fileAlert();
              return;
            }
            return this.callUpdateGroup(resData.fileUrl);
          })
        ))
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/groups']);
      }, error => {
        loadingEl.dismiss();
        this.fileAlert();
      });
    });

  }

  ngOnDestroy() {
    if (this.groupSub) {
      this.groupSub.unsubscribe();
    }
  }

  // helper method to call UpdateGroup with appropiate image url
  private callUpdateGroup(imageUrl: string) {
    return this.groupsService.updateGroup(
      this.group.id,
      this.form.value.groupName,
      imageUrl
    );
  }

  private fileAlert() {
    this.alertController.create({
      header: 'File Error',
      message: 'Something went wrong with file upload. Please retry ensuring the image is .jpg format.',
      buttons: [
        {
          text: 'Okay',
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }
}
