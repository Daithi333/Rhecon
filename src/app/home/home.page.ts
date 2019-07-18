import { Component, OnInit, OnDestroy } from '@angular/core';

import { Profile } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { Subscription } from 'rxjs';

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
