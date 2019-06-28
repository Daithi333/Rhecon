import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

import { ImageUtilService } from '../shared-portrait/image-util-service';
import { TitleData, SpecialismData, HttpService } from '../shared-http/http.service';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  titles: TitleData[] = [];
  specialisms: SpecialismData[] = [];
  form: FormGroup;
  profile: Profile;
  profileSub: Subscription;
  isLoading = false;
  imageChanged = false;
  isConsultant = true; // to be replaced by data taken from authservice: tokendata to include userTypeId

  constructor(
    private httpService: HttpService,
    private alertController: AlertController,
    private profileService: ProfileService,
    private imageUtilService: ImageUtilService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.profileSub = this.profileService.getProfile().pipe(
      switchMap(profile => {
        console.log(this.profile);
        this.profile = profile;
        return this.httpService.fetchSpecialisms();
      }),
      switchMap(specialismData => {
        this.specialisms = specialismData;
        return this.httpService.fetchTitles().pipe(
          map(titlesData => {
            this.titles = titlesData;
          })
        );
      })
    )
    .subscribe(() => {
      console.log(this.profile);
      if (this.profile.specialismId === 1) {
        this.isConsultant = false;
      }
      const selectedTitleId = this.titles.findIndex(t => t.id === this.profile.titleId);
      const selectedSpecialismId = this.specialisms.findIndex(s => s.id === this.profile.specialismId);
      this.form = new FormGroup({
        title: new FormControl(this.titles[selectedTitleId], {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        firstName: new FormControl(this.profile.firstName, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
        }),
        lastName: new FormControl(this.profile.lastName, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
        }),
        specialism: new FormControl(this.specialisms[selectedSpecialismId], {
          updateOn: 'blur'
        }),
        bio: new FormControl(this.profile.bio, {
          updateOn: 'blur'
        }),
        portraitUrl: new FormControl(null)
      });
      this.isLoading = false;
    },
    error => {
      this.isLoading = false;
      this.alertController.create({
        header: 'Error',
        message: 'Could not retrieve data, please try again shortly.',
        buttons: [
          {
            text: 'Okay',
            handler: () => {
            }
          }
        ]
      }).then(alertEl => {
        alertEl.present();
      });
    });
  }

  onImageChosen(imageData: string | File) {
    this.imageChanged = true;
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = this.imageUtilService.base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log('File conversion error: ' + error);
        // TODO - add alert if base 64 conversion to file fails
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ patientImage: imageFile });
  }

  onUpdateProfile() {

  }

  ngOnDestroy() {
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
  }

}
