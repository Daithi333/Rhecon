import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { RequestsService } from '../requests.service';
import { Request } from '../request.model';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit {
  request: Request;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private requestsService: RequestsService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('requestId')) {
        this.navController.navigateBack('/tabs/requests');
        return;
      }
      this.request = this.requestsService.getRequest(+paramMap.get('requestId'));
    });
  }

}
