import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { map, switchMap, mergeMap, takeLast } from 'rxjs/operators';
import { of, defer, iif } from 'rxjs';

import { RequestsService } from '../requests.service';
import { SelectPatientComponent } from '../../shared/select-patient/select-patient.component';
import { SelectConsultantComponent } from '../../shared/select-consultant/select-consultant.component';
import { Patient } from '../../patients/patient.model';
import { Contact } from '../../consultants/contact.model';
import { ImageUtilService } from '../../shared-portrait/image-util-service';
import { AttachmentsService } from '../attachments.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.page.html',
  styleUrls: ['./new-request.page.scss'],
})
export class NewRequestPage implements OnInit {
  requestForm: FormGroup;
  isLoading = false;
  selectedPatient: Patient;
  selectedConsultant: Contact;
  attachments: File[] = [];

  constructor(
    private requestsService: RequestsService,
    private loadingController: LoadingController,
    private router: Router,
    private modalController: ModalController,
    private imageUtilService: ImageUtilService,
    private attachmentsService: AttachmentsService
  ) {}

  ngOnInit() {
    this.requestForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, /*Validators.pattern(/^[a-zA-Z'. -]*$/)*/]
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
        validators: [Validators.required]
      }),
      attachments: new FormControl(null)
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
    // console.log(this.attachments);
    this.requestForm.patchValue({ attachments: this.attachments });
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
      if (returnedData.data != null) {
        this.requestForm.patchValue(
          {
            patient : this.selectedPatient.firstName
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
            consultant : this.selectedConsultant.title + ' ' +
            this.selectedConsultant.firstName + ' ' +
            this.selectedConsultant.lastName
          }
        );
      }
    });
  }

  // onAddRequest() {
  //   if (!this.requestForm.valid) {
  //     return;
  //   }
  //   let newRequestId;
  //   this.loadingController.create({
  //     message: 'Creating Request'
  //   })
  //   .then(loadingEl => {
  //     loadingEl.present();
  //     if (this.attachments.length <= 0) {
  //       this.callAddRequest()
  //         .subscribe(() => {
  //           // console.log('Subscribed without attachments!');
  //           this.loadingController.dismiss();
  //           this.requestForm.reset();
  //           this.router.navigate(['/tabs/requests']);
  //       });
  //     } else {
  //       this.requestsService.addRequest(
  //         this.requestForm.value.title,
  //         this.selectedPatient.id,
  //         this.selectedConsultant.id,
  //         this.requestForm.value.notes
  //       ).pipe(
  //         switchMap(requestId => {
  //           // console.log('Request id from new request page: ' + requestId);
  //           newRequestId = requestId;
  //           return of(this.attachments);
  //         }),
  //         mergeMap(attachments => {
  //           return attachments.map(attachment => {
  //             // console.log(attachment);
  //             return attachment;
  //           });
  //         }),
  //         mergeMap(attachment => {
  //           return this.attachmentsService.addAttachmentFile(attachment).pipe(
  //             map(fileData => {
  //               // console.log('File data: ' + fileData);
  //               return fileData;
  //             })
  //           );
  //         }),
  //         mergeMap(fileData => {
  //           return this.attachmentsService.addAttachment(newRequestId, fileData.fileUrl).pipe(
  //             map(attachments => {
  //               // console.log('Attachments: ' + attachments);
  //               return attachments;
  //             })
  //           );
  //         }),
  //         takeLast(1)
  //       )
  //       .subscribe(() => {
  //         // console.log('Subscribed after processing attachments!');
  //         this.loadingController.dismiss();
  //         this.requestForm.reset();
  //         this.attachments.splice(0, this.attachments.length);
  //         this.router.navigate(['/tabs/requests']);
  //       });
  //     }
  //   });
  // }

  onAddRequest() {
    if (!this.requestForm.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Creating Request'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.getRequest(this.attachments).subscribe(() => {
        // console.log('Subscribed!');
        this.loadingController.dismiss();
        this.requestForm.reset();
        this.attachments.splice(0, this.attachments.length);
        this.router.navigate(['/tabs/requests']);
      });
    });
  }

  // method to call the update request method and chain on attachments requests if there are any
  private getRequest(attachments) {
    let newRequestId;
    return iif (
      () => attachments.length === 0,
      defer(() => this.callAddRequest().pipe()),
      defer(() => this.callAddRequest().pipe(
        switchMap(requestId => {
          newRequestId = requestId;
          return of(this.attachments);
        }),
        mergeMap(attachmentsArr => {
          return attachmentsArr.map(attachment => {
            return attachment;
          });
        }),
        mergeMap(attachment => {
          return this.attachmentsService.addAttachmentFile(attachment).pipe(
            map(fileData => {
              return fileData;
            })
          );
        }),
        mergeMap(fileData => {
          return this.attachmentsService.addAttachment(newRequestId, fileData.fileUrl).pipe(
            map(attachmentsArr => {
              return attachmentsArr;
            })
          );
        }),
        takeLast(1)
      ))
    );
  }

  private callAddRequest() {
    return this.requestsService.addRequest(
      this.requestForm.value.title,
      this.selectedPatient.id,
      this.selectedConsultant.id,
      this.requestForm.value.notes
    );
  }

}
