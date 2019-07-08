import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, of, iif, defer } from 'rxjs';
import { mergeMap, map, switchMap, takeLast, take } from 'rxjs/operators';

import { RequestsService } from '../requests.service';
import { SelectPatientComponent } from '../../shared/select-patient/select-patient.component';
import { SelectConsultantComponent } from '../../shared/select-consultant/select-consultant.component';
import { Patient } from '../../patients/patient.model';
import { Contact } from '../../consultants/contact.model';
import { RequestWithObjects } from '../request-with-objects.model';
import { AttachmentsService } from '../attachments.service';
import { ImageUtilService } from '../../shared-portrait/image-util-service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.page.html',
  styleUrls: ['./edit-request.page.scss'],
})
export class EditRequestPage implements OnInit, OnDestroy {
  request: RequestWithObjects;
  requestId: number;
  requestForm: FormGroup;
  isLoading = false;
  selectedPatient: Patient;
  selectedConsultant: Contact;
  attachmentUrls: string[] = [];
  attachments: File[] = [];
  userType: string;
  private requestSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private requestsService: RequestsService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private router: Router,
    private attachmentsService: AttachmentsService,
    private imageUtilService: ImageUtilService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('requestId')) {
        this.navController.navigateBack('/tabs/requests');
        return;
      }
      this.isLoading = true;
      this.requestId = +paramMap.get('requestId');
      this.requestSub = this.authService.userType.pipe(
        take(1),
        switchMap(userType => {
          this.userType = userType;
          return this.requestsService.getRequestWithObjects(+paramMap.get('requestId'));
        }),
        mergeMap(request => {
          this.request = request;
          this.selectedPatient = request.patient;
          this.selectedConsultant = request.consultant;
          return this.attachmentsService.fetchAttachments(request.id)
            .pipe(
              map(attachments => {
                this.attachmentUrls = attachments;
              })
            );
        })
      )
      .subscribe(request => {
        this.requestForm = new FormGroup({
          title: new FormControl(this.request.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          patient: new FormControl(`${this.request.patient.firstName} ${this.request.patient.lastName}`, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          consultant: new FormControl(
            `${this.request.consultant.title} ${this.request.consultant.firstName} ${this.request.consultant.lastName}`, {
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
  }

  ionViewDidLeave() {
    console.log('ionViewDidLeave.. Splicing attachments!');
    this.attachments.splice(0, this.attachments.length);
    this.attachmentUrls.splice(0, this.attachments.length);
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
        if (returnedData.data != null) {
          this.selectedPatient = returnedData.data;
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

  onAttachmentChosen(attachmentData: string | File) {
    let attachmentFile;
    if (typeof attachmentData === 'string') {
      try {
        attachmentFile = this.imageUtilService.base64toBlob(
          attachmentData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log('File conversion error: ' + error);
        // TODO - add alert if conversion to file fails
      }
    } else {
      attachmentFile = attachmentData;
    }
    this.attachments.push(attachmentFile);
    this.requestForm.patchValue({ attachments: this.attachments });
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
      this.getRequest(this.attachments).subscribe(() => {
        console.log('Subscribed');
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
  }

  // method to call the update request method and chain on attachments requests if there are any
  private getRequest(attachments) {
    const updateRequestObs = this.requestsService.updateRequest(
      this.request.id,
      this.requestForm.value.title,
      this.selectedPatient.id,
      this.selectedConsultant.id,
      this.requestForm.value.notes
    );
    return iif (
      () => attachments.length === 0,
      defer(() => updateRequestObs),
      defer(() => updateRequestObs.pipe(
        switchMap(() => {
          return of(this.attachments);
        }),
        mergeMap(attachmentsArr => {
          console.log(attachmentsArr);
          return attachmentsArr.map(attachment => {
            return attachment;
          });
        }),
        mergeMap(attachment => {
          return this.attachmentsService.addAttachmentFile(attachment).pipe(
            map(fileData => {
              // console.log(fileData);
              return fileData;
            })
          );
        }),
        mergeMap(fileData => {
          return this.attachmentsService.addAttachment(this.requestId, fileData.fileUrl).pipe(
            map(attachmentsArr => {
              // console.log('Attachments: ' + attachments);
              return attachmentsArr;
            })
          );
        }),
        takeLast(1)
      ))
    );
  }

}
