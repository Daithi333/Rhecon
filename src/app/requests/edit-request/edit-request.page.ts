import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Request } from '../request.model';
import { NavController } from '@ionic/angular';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.page.html',
  styleUrls: ['./edit-request.page.scss'],
})
export class EditRequestPage implements OnInit {
  request: Request;

  constructor(private route: ActivatedRoute,
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
