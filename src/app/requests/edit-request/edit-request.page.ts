import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, of, iif, defer } from 'rxjs';
import { mergeMap, map, switchMap, takeLast, take } from 'rxjs/operators';

import { RequestsService } from '../requests.service';
import { SelectPatientComponent } from '../../shared/select-patient/select-patient.component';
import { SelectConsultantComponent } from '../../shared/select-consultant/select-consultant.component';
import { Patient } from '../../patients/patient.model';
import { Contact } from '../../consultants/contact.model';
import { RequestWithObjects } from '../request-with-objects.model';
import { AttachmentsService } from '../../shared/attachments.service';
import { ImageUtilService } from '../../shared-portrait/image-util-service';
import { AuthService } from '../../auth/auth.service';

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
    private authService: AuthService,
    private alertController: AlertController
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
      },
      error => {
        this.alertController.create({
          header: 'Error',
          message: 'Could not locate request.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/tabs/requests']);
              }
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  ionViewDidLeave() {
    // empty the local attachments array if user leaves page
    this.attachments.splice(0, this.attachments.length);
    this.attachmentUrls.splice(0, this.attachments.length);
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

  // calls the update request method in the requests service
  onUpdateRequest() {
    if (!this.requestForm.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Updating Request'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.callUpdateRequest(this.attachments).subscribe(() => {
        loadingEl.dismiss();
        this.requestForm.reset();
        this.router.navigate(['/tabs/requests']);
      }, error => {
        loadingEl.dismiss();
        this.fileUploadAlert(error.error.message);
      });
    });
  }

  ngOnDestroy() {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

  // helper method to call the update request method and include attachments handling if new ones were added 
  private callUpdateRequest(attachments) {
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
          if (!fileData.fileUrl) {
            throw new Error(fileData.message);
          }
          return this.attachmentsService.addAttachment(this.requestId, fileData.fileUrl).pipe(
            map(attachmentsArr => {
              return attachmentsArr;
            })
          );
        }),
        takeLast(1)
      ))
    );
  }
  // helper method with file upload error alert
  private fileUploadAlert(errorMsg: string) {
    this.alertController.create({
      header: 'Upload Error',
      message: `Unable to upload file: ${errorMsg}`,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            this.router.navigateByUrl('/tabs/requests/' + this.requestId);
          }
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
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
