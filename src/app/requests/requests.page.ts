import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { IonItemSliding, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { RequestsService } from './requests.service';
import { RequestWithPatientAndConsultant } from './request-patient-consultant.model';
import { AuthService } from '../auth/auth.service';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit, OnDestroy {
  requests: RequestWithPatientAndConsultant[] = [];
  viewableRequests: RequestWithPatientAndConsultant[] = [];
  isLoading = false;
  currentSegment = 'active';
  private requestSub: Subscription;
  private userType: string;

  constructor(
    private requestsService: RequestsService,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.requestSub = this.authService.userType.pipe(
      take(1),
      switchMap(userType => {
        this.userType = userType;
        return this.requestsService.requestsWithPatientAndConsultant;
      })
    )
    .subscribe(requests => {
      this.requests = requests;
      console.log(this.userType);
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
    this.requestsService.fetchRequestsWithPatientAndConsultant().subscribe(() => {
      this.isLoading = false;
    });
  }

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

  onEdit(requestId: number, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'tabs', 'requests', 'edit-request', requestId]);
    console.log('Editing request ', requestId);
  }

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
