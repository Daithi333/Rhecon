import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { map, switchMap, mergeMap, takeLast } from 'rxjs/operators';
import { of, defer, iif } from 'rxjs';

import { RequestsService } from '../requests.service';
import { SelectPatientComponent } from '../../shared/select-patient/select-patient.component';
import { SelectConsultantComponent } from '../../shared/select-consultant/select-consultant.component';
import { Patient } from '../../patients/patient.model';
import { Contact } from '../../consultants/contact.model';
import { ImageUtilService } from '../../shared-portrait/image-util-service';
import { AttachmentsService } from '../../shared/attachments.service';

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
    private attachmentsService: AttachmentsService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.requestForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
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

  // patch file into form, converting first into blob if it is a string from Camera API
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
        this.fileConversionAlert();
      }
    } else {
      attachmentFile = attachmentData;
    }
    this.attachments.push(attachmentFile);
    this.requestForm.patchValue({ attachments: this.attachments });
  }

  // remove an attachment from form
  onRemoveAttachment(attachmentIndex: number) {
    this.attachments.splice(attachmentIndex, 1);
    this.requestForm.patchValue({ attachments: this.attachments });
  }

  // opens the patient select modal
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

  // opens the consultant select modal
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

  // calls the add request method in the requests service
  onAddRequest() {
    if (!this.requestForm.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Creating Request'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.handleAttachments(this.attachments).subscribe(() => {
        this.loadingController.dismiss();
        this.requestForm.reset();
        this.attachments.splice(0, this.attachments.length);
        this.router.navigate(['/tabs/requests']);
      }, error => {
        this.loadingController.dismiss();
        const errorMsg = error.error.message;
        console.log(errorMsg);
      });
    });
  }

  // method to call the update request method and chain on attachments requests if there are any
  private handleAttachments(attachments) {
    let newRequestId;
    const addRequestObs = this.requestsService.addRequest(
      this.requestForm.value.title,
      this.selectedPatient.id,
      this.selectedConsultant.id,
      this.requestForm.value.notes
    );
    return iif (
      () => attachments.length === 0,
      defer(() => addRequestObs),
      defer(() => addRequestObs.pipe(
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
          console.log(fileData);
          if (!fileData.fileUrl) {
            throw new Error(fileData.message);
          }
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

  // helper method to alert user of file conversion error
  private fileConversionAlert() {
    this.alertController.create({
      header: 'File Error',
      message: 'Something went wrong with file. Please retry ensuring the image is .jpg format.',
      buttons: [
        {
          text: 'Okay',
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }
}
