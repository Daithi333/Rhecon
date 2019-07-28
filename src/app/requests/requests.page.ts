import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { IonItemSliding, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { RequestsService } from './requests.service';
import { RequestWithObjects } from './request-with-objects.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit, OnDestroy {
  requests: RequestWithObjects[] = [];
  viewableRequests: RequestWithObjects[] = [];
  isLoading = false;
  currentSegment = 'active';
  userType: string;
  private requestSub: Subscription;

  constructor(
    private requestsService: RequestsService,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.requestSub = this.authService.userType.pipe(
      take(1),
      switchMap(userType => {
        this.userType = userType;
        return this.requestsService.requestsWithObjects;
      })
    )
    .subscribe(requests => {
      this.requests = requests;
      if (this.currentSegment === 'active') {
        this.viewableRequests = this.requests.filter(
          r => r.active === true
        );
      } else {
        this.viewableRequests = this.requests.filter(
          r => r.active === false
        );
      }
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.loadingController
      .create({keyboardClose: true, message: 'Retrieving requests..'})
      .then(loadingEl => {
        loadingEl.present();
        this.requestsService.fetchRequestsWithObjects()
          .subscribe(() => {
            this.isLoading = false;
            loadingEl.dismiss();
          });
      });
  }

   // toggles active or inactive segments based on the toggle event
  onSegmentToggle(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'active') {
      this.currentSegment = 'active';
      this.viewableRequests = this.requests.filter(
        rd => rd.active === true
      );
    } else {
      this.currentSegment = 'inactive';
      this.viewableRequests = this.requests.filter(
        rd => rd.active === false
      );
    }
  }

  // navigates to Edit Request page from the request item's slider
  onEdit(requestId: number, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'tabs', 'requests', 'edit-request', requestId]);
  }

  // calls the close request method in the requests service
  onCloseRequest(requestId: number, slidingItem: IonItemSliding) {
    this.alertController.create({
      header: 'Confirm closure',
      message: 'Are you sure you wish to close this request?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.requestsService.closeRequest(requestId).subscribe(() => {
              slidingItem.close();
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            slidingItem.close();
        }
      }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  // calls the reopen request method in the requests service
  onReopenRequest(requestId: number, slidingItem: IonItemSliding) {
    this.alertController.create({
      header: 'Confirm reopen',
      message: 'Are you sure you wish to reopen this request?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.requestsService.reopenRequest(requestId).subscribe(() => {
              slidingItem.close();
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            slidingItem.close();
        }
      }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  // calls the delete request method in the requests service
  onDeleteRequest(requestId: number, slidingItem: IonItemSliding) {
    this.alertController.create({
      header: 'Confirm deletion',
      message: 'Are you sure you wish to permanently delete this request?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.requestsService.deleteRequest(requestId).subscribe(() => {
              slidingItem.close();
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            slidingItem.close();
        }
      }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

}
