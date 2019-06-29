import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Profile } from './profile.model';

interface ProfileData {
  id: number;
  titleId: number;
  firstName: string;
  lastName: string;
  specialismId: number;
  portraitUrl: string;
  bio: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _profile = new BehaviorSubject<Profile>(null);

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  get profile() {
    return this._profile.asObservable();
  }

  fetchProfile() {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return this.httpClient.get<ProfileData>(
          `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/user/read_profile.php?id=${userId}`
        );
      }),
      map(profileData => {
        return new Profile(
          +profileData.id,
          +profileData.titleId,
          profileData.firstName,
          profileData.lastName,
          +profileData.specialismId,
          profileData.portraitUrl,
          profileData.bio
        );
      }),
      tap(profile => {
        this._profile.next(profile);
      })
    );
  }

  addImage(imageFile: File) {
    const imageData = new FormData();
    imageData.append('fileUpload', imageFile);

    return this.httpClient.post<{fileUrl: string, filePath: string}>(
      'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/file/user_image_upload.php',
      imageData
    );
  }

  updateProfile(
    id: number,
    titleId: number,
    firstName: string,
    lastName: string,
    specialismId: number,
    portraitUrl: string,
    bio: string
  ) {
    const updatedProfile = new Profile(
      id,
      titleId,
      firstName,
      lastName,
      specialismId,
      portraitUrl,
      bio
    );
    console.log(updatedProfile);
    return this.httpClient.put(
      'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/user/update_profile.php',
      updatedProfile
    ).pipe(
      tap(() => {
        this._profile.next(updatedProfile);
      })
    );
  }

}
