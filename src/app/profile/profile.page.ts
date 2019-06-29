import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
    this.profileSub = this.profileService.fetchProfile().pipe(
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
      this.selectedTitle = this.titles.find(t => t.id === this.profile.titleId);
      this.selectedSpecialism = this.specialisms.find(s => s.id === this.profile.specialismId);
      if (this.profile.specialismId === 1) {
        this.isConsultant = false;
      }
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
  }

}
