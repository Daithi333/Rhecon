import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { PatientsService } from 'src/app/patients/patients.service';
import { ConsultantsService } from 'src/app/consultants/consultants.service';
import { RequestsService } from '../requests.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.page.html',
  styleUrls: ['./new-request.page.scss'],
})
export class NewRequestPage implements OnInit {
  requestForm: FormGroup;
  isLoading = false;

  constructor(
    private patientsService: PatientsService,
    private usersService: ConsultantsService,
    private requestsService: RequestsService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.requestForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
      }),
      patient: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      consultant: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      notes: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
      }),
    });
  }

  onAddRequest() {
    if (!this.requestForm.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Creating Request'
    }).then(loadingEl => {
      loadingEl.present();
      this.requestsService.addRequest(
        this.requestForm.value.title,
        this.requestForm.value.patient.id,
        this.requestForm.value.consultant.id,
        this.requestForm.value.notes
      ).subscribe(() => {
        this.loadingController.dismiss();
        this.requestForm.reset();
        this.router.navigate(['/tabs/requests']);
      });
    });
  }

}
