import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';

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
  profile: Profile;
  profileSub: Subscription;
  isLoading = false;
  isConsultant = true; // to be replaced by data taken from authservice: tokendata to include userTypeId
  selectedTitle: TitleData;
  selectedSpecialism: SpecialismData;

  constructor(
    private httpService: HttpService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    forkJoin([
      this.profileService.fetchProfile(),
      this.httpService.fetchSpecialisms(),
      this.httpService.fetchTitles()
    ])
    .subscribe(([profile, specialisms, titles])  => {
      this.profile = profile;
      this.specialisms = specialisms;
      this.titles = titles;
      this.selectedTitle = this.titles.find(t => t.id === this.profile.titleId);
      this.selectedSpecialism = this.specialisms.find(s => s.id === this.profile.specialismId);
      if (this.profile.specialismId === 1) {
        this.isConsultant = false;
      }
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
