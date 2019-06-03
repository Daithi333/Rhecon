import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Request } from '../request.model';
import { RequestsService } from '../requests.service';
import { SelectPatientComponent } from '../../shared/select-patient/select-patient.component';
import { SelectConsultantComponent } from '../../shared/select-consultant/select-consultant.component';
import { Patient } from '../../patients/patient.model';
import { Consultant } from '../../consultants/consultant.model';
import { ConsultantsService } from 'src/app/consultants/consultants.service';
import { PatientsService } from 'src/app/patients/patients.service';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.page.html',
  styleUrls: ['./edit-request.page.scss'],
})
export class EditRequestPage implements OnInit, OnDestroy {
  request: Request;
  requestForm: FormGroup;
  isLoading = false;
  selectedPatient: Patient;
  selectedConsultant: Consultant;
  private requestSub: Subscription;
  private patientSub: Subscription;
  private consultantSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private requestsService: RequestsService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private router: Router,
    private usersService: ConsultantsService,
    private patientsService: PatientsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('requestId')) {
        this.navController.navigateBack('/tabs/requests');
        return;
      }
      this.isLoading = true;
      this.requestSub = this.requestsService.getRequest(+paramMap.get('requestId'))
      .subscribe(req => {
        this.request = req;
        this.patientSub = this.patientsService.getPatient(this.request.patientId)
          .subscribe(pat => {
            this.selectedPatient = pat;
            this.consultantSub = this.usersService.getConsultant(this.request.consultantId)
            .subscribe(cons => {
              this.selectedConsultant = cons;
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
              this.isLoading = false;
            });
          });
      });
    });

  }

  onPatientSelect() {
    this.modalController.create({
      component: SelectPatientComponent,
      id: 'patientSelect'
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(returnedData => {
        this.selectedPatient = returnedData.data;
        console.log(returnedData.data);
        if (returnedData.data != null) {
          this.requestForm.patchValue(
            {
              patient: this.selectedPatient.firstName
                + ' ' +
                this.selectedPatient.lastName
            }
          );
        }
      });
  }

  onConsultantSelect() {
    this.modalController.create({
      component: SelectConsultantComponent,
      id: 'consultantSelect'
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(returnedData => {
        this.selectedConsultant = returnedData.data;
        if (returnedData.data != null) {
          this.requestForm.patchValue(
            {
              consultant: this.selectedConsultant.title
                + ' ' +
                this.selectedConsultant.firstName
                + ' ' +
                this.selectedConsultant.lastName
            }
          );
        }
      });
  }

  onUpdateRequest() {
    if (!this.requestForm.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Updating Request'
    })
      .then(loadingEl => {
        loadingEl.present();
        this.requestsService.updateRequest(
          this.request.id,
          this.requestForm.value.title,
          this.selectedPatient.id,
          this.selectedConsultant.id,
          this.requestForm.value.notes
        )
          .subscribe(() => {
            loadingEl.dismiss();
            this.requestForm.reset();
            this.router.navigate(['/tabs/requests']);
          });
      });
  }

  ngOnDestroy() {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
    if (this.patientSub) {
      this.patientSub.unsubscribe();
    }
    if (this.consultantSub) {
      this.consultantSub.unsubscribe();
    }
  }

}
