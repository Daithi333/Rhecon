import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { RequestsService } from './requests.service';
import { RequestData } from './request-data.model';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit, OnDestroy {
  requestData: RequestData[];
  viewableRequests: RequestData[];
  isLoading = false;
  private requestSub: Subscription;
  private currentSegment = 'active';

  constructor(
    private requestsService: RequestsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.requestSub = this.requestsService.getRequestsWithPatientAndConsultant()
      .subscribe(requestData => {
        this.requestData = requestData;

        if (this.currentSegment === 'active') {
          this.viewableRequests = this.requestData.filter(
            rd => rd.requestActive === true
          );
        } else {
          this.viewableRequests = this.requestData.filter(
            rd => rd.requestActive === false
          );
        }
        this.isLoading = false;
    });

  }

  ionViewWillEnter() {
  }

  onSegmentToggle(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'active') {
      this.currentSegment = 'active';
      this.viewableRequests = this.requestData.filter(
        rd => rd.requestActive === true
      );
    } else {
      this.currentSegment = 'inactive';
      this.viewableRequests = this.requestData.filter(
        rd => rd.requestActive === false
      );
    }
  }

  ngOnDestroy() {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

}
