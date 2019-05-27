import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PatientsService } from 'src/app/patients/patients.service';
import { ConsultantsService } from 'src/app/consultants/consultants.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.page.html',
  styleUrls: ['./new-request.page.scss'],
})
export class NewRequestPage implements OnInit {
  requestForm: FormGroup;
  isLoading = false;
  selectedPatient = 'Select patient';
  selectedConsultant = 'Select consultant';

  constructor(private patientsService: PatientsService, private usersService: ConsultantsService) { }

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
      details: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
      }),
    });
  }

  onAddRequest() {
    if (!this.requestForm.valid) {
      return;
    }
    console.log(this.requestForm);
  }

}
