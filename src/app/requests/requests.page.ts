import { Component, OnInit } from '@angular/core';
import { Request } from './request.model';
import { RequestsService } from './requests.service';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit {
  activeRequests: Request[];
  inactiveRequests: Request[];

  constructor(private requestsService: RequestsService) { }

  ngOnInit() {
    this.activeRequests = this.requestsService.activeRequests;
    this.inactiveRequests = this.requestsService.inactiveRequests;
  }

  onSegmentToggle(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log('event.detail');
  }

}
