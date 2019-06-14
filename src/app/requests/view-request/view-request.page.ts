import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RequestsService } from '../requests.service';
import { RequestWithPatientAndConsultant } from '../request-patient-consultant.model';
import { map, mergeMap } from 'rxjs/operators';
import { AttachmentsService } from '../attachments.service';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit, OnDestroy {
  request: RequestWithPatientAndConsultant;
  requestId: number;
  attachments: string[] = [];
  canEdit = true;
  isLoading = false;
  private requestSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private requestsService: RequestsService,
    private router: Router,
    private alertController: AlertController,
    private attachmentsService: AttachmentsService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('requestId')) {
        this.navController.navigateBack('/tabs/requests');
        return;
      }
      this.isLoading = true;
      this.requestId = +paramMap.get('requestId');
      this.requestSub = this.requestsService.getRequestWithPatientAndConsultant(+paramMap.get('requestId'))
        .pipe(
          mergeMap(request => {
            this.request = request;
            return this.attachmentsService.fetchAttachments(request.id)
              .pipe(
                map(attachments => {
                  this.attachments = attachments;
                })
              );
          })
        )
        .subscribe(() => {
          if (this.request.active === false) {
            this.canEdit = false;
          }
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

  onSelectFile() {
    this.alertController.create({
      header: 'Download',
      message: 'Do you wish to download this attachment?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            // TODO
          }
        },
        {
          text: 'No'
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

}
