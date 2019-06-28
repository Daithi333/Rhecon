import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take, switchMap, map } from 'rxjs/operators';

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

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  getProfile() {
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
      })
    );
  }

  updateUserProfile(
    userId: number,
    titleId: number,
    firstName: string,
    lastName: string,
    specialismId: number,
    portraitUrl: string,
    bio: string
  ) {
    const updatedProfile = new Profile(
      userId,
      titleId,
      firstName,
      lastName,
      specialismId,
      portraitUrl,
      bio
    );
    return this.httpClient.put(
      'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/contact/update.php',
      { updatedProfile }
    );
  }

}
