import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PatientsService } from '../patients.service';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.page.html',
  styleUrls: ['./new-patient.page.scss'],
})
export class NewPatientPage implements OnInit {
  form: FormGroup;
  isLoading = false;
  placeholderImage = 'http://goldenayeyarwaddytravels.com/sites/default/files/default_images/default-user-icon-8.jpg';

  constructor(private patientsService: PatientsService) { }

  ngOnInit() {
    // create reactive form group and controls
    this.form = new FormGroup({
      firstName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
      }),
      lastName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
      }),
      dob: new FormControl(null, {
        updateOn: 'blur'
      }),
      notes: new FormControl(null, {
        updateOn: 'blur'
      }),
      patientImage: new FormControl(this.placeholderImage, {
        updateOn: 'blur'
      })
    });
  }

  onAddPatient() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form);
  }

}
