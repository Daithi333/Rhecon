import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription, iif, defer } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Group } from '../group-model';
import { GroupsService } from '../groups.service';
import { switchMap } from 'rxjs/operators';
import { ImageUtilService } from '../../shared-portrait/image-util-service';

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
    private imageUtilService: ImageUtilService
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
          this.selectedImage = group.imageUrl;
          this.form = new FormGroup({
            groupName: new FormControl(this.group.groupName, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            imageUrl: new FormControl(this.group.imageUrl)
          });
          this.isLoading = false;
        });
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
            // TODO - handle error from the add image function - server, size, etc
            return this.callUpdateGroup(resData.fileUrl);
          })
        ))
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/groups']);
      });
    });

  }

  ngOnDestroy() {
    if (this.groupSub) {
      this.groupSub.unsubscribe();
    }
  }

  // call UpdateGroup method with appropiate image url
  private callUpdateGroup(imageUrl: string) {
    return this.groupsService.updateGroup(
      this.group.id,
      this.form.value.groupName,
      imageUrl
    );
  }
}