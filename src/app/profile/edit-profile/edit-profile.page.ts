import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, defer, iif, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AlertController, LoadingController } from '@ionic/angular';

import { Profile } from '../profile.model';
import { SpecialismData, TitleData, HttpService } from '../../shared-http/http.service';
import { ProfileService } from '../profile.service';
import { ImageUtilService } from '../../shared-portrait/image-util-service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit, OnDestroy {
  titles: TitleData[] = [];
  specialisms: SpecialismData[] = [];
  form: FormGroup;
  profile: Profile;
  profileSub: Subscription;
  userType: string;
  isLoading = false;
  imageChanged = false;

  constructor(
    private httpService: HttpService,
    private alertController: AlertController,
    private profileService: ProfileService,
    private imageUtilService: ImageUtilService,
    private loadingController: LoadingController,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.profileSub = forkJoin([
      this.profileService.fetchProfile(),
      this.httpService.fetchSpecialisms(),
      this.httpService.fetchTitles(),
      this.authService.userType
    ])
    .subscribe(([profile, specialisms, titles, userType])  => {
      this.profile = profile;
      this.specialisms = specialisms;
      this.titles = titles;
      this.userType = userType;
      const selectedSpecialism = this.specialisms.find(s => s.id === this.profile.specialismId);
      const selectedTitle = this.titles.find(t => t.id === this.profile.titleId);

      this.form = new FormGroup({
        title: new FormControl(selectedTitle, {
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
        specialism: new FormControl(selectedSpecialism, {
          updateOn: 'blur'
        }),
        bio: new FormControl(this.profile.bio, {
          updateOn: 'blur'
        }),
        // country: new FormControl(null, {
        //   updateOn: 'blur'
        // }),
        portraitUrl: new FormControl(null)
      });
      this.isLoading = false;
    },
    error => {
      this.isLoading = false;
      this.alertController.create({
        header: 'Error',
        message: 'Could not retrieve profile, please try again later.',
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
    this.form.patchValue({ portraitUrl: imageFile });
  }

  onUpdateProfile() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Updating Profile'
    }).then(loadingEl => {
      loadingEl.present();
      iif (
        () => !this.imageChanged,
        defer(() => this.callUpdateProfile(this.profile.portraitUrl)),
        defer(() => this.profileService.addImage(this.form.get('portraitUrl').value).pipe(
          switchMap(resData => {
            console.log(resData);
            // TODO - handle error from the add image function - server, size, etc
            return this.callUpdateProfile(resData.fileUrl);
          })
        ))
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/profile']);
      });
    });
  }

  ngOnDestroy() {
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
  }

  private callUpdateProfile(userImage: string) {
    return this.profileService.updateProfile(
      this.profile.id,
      this.form.value.title.id,
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.specialism.id,
      userImage,
      this.form.value.bio
    );
  }

}
