import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Profile } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  profile: Profile;
  profileSub: Subscription;
  isLoading = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.isLoading = true;
    this.profileService.fetchProfile()
      .subscribe(profile => {
      this.profile = profile;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.profileSub) {
      this.profileSub.unsubscribe();
    }
  }
}
