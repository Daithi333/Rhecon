import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

import { RequestsService } from '../requests.service';
import { RequestWithObjects } from '../request-with-objects.model';
import { AttachmentsService } from '../attachments.service';
import { AuthService } from '../../auth/auth.service';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { CommentsService } from './comments.service';
import { Comment } from './comment.model';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit, OnDestroy {
  request: RequestWithObjects;
  requestId: number;
  attachments: string[] = [];
  comments: Comment[] = [];
  canEdit = true;
  isLoading = false;
  userType: string;
  private requestSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private alertController: AlertController,
    private modalController: ModalController,
    private requestsService: RequestsService,
    private attachmentsService: AttachmentsService,
    private authService: AuthService,
    private commentsService: CommentsService
  ) { }

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
        switchMap(request => {
          this.request = request;
          return this.attachmentsService.fetchAttachments(request.id);
        }),
        switchMap(attachments => {
          this.attachments = attachments;
          return this.commentsService.fetchComments(this.requestId);
        })
      )
      .subscribe(comments => {
        this.comments = comments;
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

  openCommentModal() {
    this.modalController.create({
      component: AddCommentComponent,
      componentProps: {
        requestId: this.requestId
      },
      id: 'addComment'
    })
    .then(modalEl => {
      modalEl.present();
    });
  }

  ngOnDestroy() {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

}
