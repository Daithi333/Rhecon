import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { iif, defer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { GroupsService } from '../groups.service';
import { ImageUtilService } from '../../shared-portrait/image-util-service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.page.html',
  styleUrls: ['./new-group.page.scss'],
})
export class NewGroupPage implements OnInit {
  form: FormGroup;
  isLoading = false;
  selectedImage = 'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/files/default-group-icon.jpg';
  private imageChanged = false;
  @ViewChild('fileSelector') fileSelector: ElementRef<HTMLInputElement>;

  constructor(
    private groupsService: GroupsService,
    private loadingController: LoadingController,
    private router: Router,
    private imageUtilService: ImageUtilService
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

  onFileChosen(event: Event) {
    this.imageChanged = true; // track if new image was added and needs uploaded
    const chosenFile = (event.target as HTMLInputElement).files[0];
    if (!chosenFile) {
      // TODO - add alert
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      // let attachmentFile;
      // if (typeof chosenFile === 'string') {
      //   try {
      //     attachmentFile = this.imageUtilService.base64toBlob(
      //       chosenFile.replace('data:image/jpeg;base64,', ''),
      //       'image/jpeg'
      //     );
      //   } catch (error) {
      //     console.log('File conversion error: ' + error);
      //     // TODO - add alert if conversion to file fails
      //   }
      // } else {
      //   attachmentFile = chosenFile;
      // }
      this.form.patchValue({ imageUrl: chosenFile });
    };
    fr.readAsDataURL(chosenFile);
  }

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
            // TODO - handle error from the add image function - server, size, etc
            return this.callAddGroup(resData.fileUrl);
          })
        ))
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/groups']);
      });
    });
  }

  // call AddGroup method with appropiate image url
  private callAddGroup(imageUrl: string) {
    return this.groupsService.addGroup(
      this.form.value.groupName,
      imageUrl
    );
  }


}
