import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { iif, defer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GroupsService } from '../groups.service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.page.html',
  styleUrls: ['./new-group.page.scss'],
})
export class NewGroupPage implements OnInit {
  form: FormGroup;
  isLoading = false;
  selectedImage = '../../assets/icon/default-group-icon.jpg';
  private imageChanged = false;
  @ViewChild('fileSelector') fileSelector: ElementRef<HTMLInputElement>;

  constructor(
    private groupsService: GroupsService,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      groupName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
        imageUrl: new FormControl(this.selectedImage)
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

  // Call addGroup if no image, or addimage first if there is
  onAddGroup() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Adding Group'
    }).then(loadingEl => {
      loadingEl.present();
      iif (
        () => !this.imageChanged,
        defer(() => this.callAddGroup(this.selectedImage)),
        defer(() => this.groupsService.addImage(this.form.get('imageUrl').value).pipe(
          switchMap(resData => {
            if (resData.message) {
              this.fileAlert();
              return;
            }
            return this.callAddGroup(resData.fileUrl);
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

  // helper method to call addGroup with appropiate image url
  private callAddGroup(imageUrl: string) {
    return this.groupsService.addGroup(
      this.form.value.groupName,
      imageUrl
    );
  }

  private fileAlert() {
    this.alertController.create({
      header: 'File Error',
      message: 'Something went wrong with file upload. Please ensure the image is .jpg format.',
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
