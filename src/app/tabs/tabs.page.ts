import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
  userType: string;
  userTypeSub: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userTypeSub = this.authService.userType.subscribe(userType => {
      this.userType = userType;
    });
  }

  ngOnDestroy() {
    if (this.userTypeSub) {
      this.userTypeSub.unsubscribe();
    }
  }

}
