import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Request } from '../request.model';
import { RequestsService } from '../requests.service';
import { SelectPatientComponent } from '../select-patient/select-patient.component';
import { SelectConsultantComponent } from '../select-consultant/select-consultant.component';

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
              private requestsService: RequestsService,
              private modalController: ModalController
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
        notes: new FormControl(this.request.notes, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
      });
    });
  }

  onUpdateRequest() {
    console.log(this.requestForm);
  }

  onPatientSelect() {
    this.modalController.create({
      component: SelectPatientComponent,
      id: 'patientSelect'
    }).then(modalEl => {
      modalEl.present();
    });
  }

  onConsultantSelect() {
    this.modalController.create({
      component: SelectConsultantComponent,
      id: 'consultantSelect'
    }).then(modalEl => {
      modalEl.present();
    });
  }

  ngOnDestroy() {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

}
