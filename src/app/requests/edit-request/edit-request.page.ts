import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Request } from '../request.model';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.page.html',
  styleUrls: ['./edit-request.page.scss'],
})
export class EditRequestPage implements OnInit, OnDestroy {
  request: Request;
  requestForm: FormGroup;
  isLoading = false;
  private requestSub: Subscription;

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
      this.requestSub = this.requestsService.getRequest(+paramMap.get('requestId'))
        .subscribe(request => {
          this.request = request;
        });
      this.requestForm = new FormGroup({
        title: new FormControl(this.request.title, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        patient: new FormControl(this.request.patientId, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        consultant: new FormControl(this.request.consultantId, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        details: new FormControl(this.request.notes, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
      });
    });
  }

  onUpdateRequest() {
    console.log(this.requestForm);
  }

  ngOnDestroy() {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

}
