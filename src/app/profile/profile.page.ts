import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';

import { TitleData, SpecialismData, HttpService } from '../shared-http/http.service';
import { ProfileService } from './profile.service';
import { Profile } from './profile.model';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  titles: TitleData[] = [];
  specialisms: SpecialismData[] = [];
  profile: Profile;
  userType: string;
  profileSub: Subscription;
  isLoading = false;
  selectedTitle: TitleData;
  selectedSpecialism: SpecialismData;

  constructor(
    private httpService: HttpService,
    private profileService: ProfileService,
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
      this.selectedTitle = this.titles.find(t => t.id === this.profile.titleId);
      this.selectedSpecialism = this.specialisms.find(s => s.id === this.profile.specialismId);
      this.isLoading = false;
    });
  }

  ionViewWillEnter() {
    this.profileService.profile.subscribe(profile => {
      this.profile = profile;
    });
  }

  ngOnDestroy() {
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
  }

}
