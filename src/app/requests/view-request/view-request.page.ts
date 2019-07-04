import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, switchMap, map } from 'rxjs/operators';
import * as FileSaver from 'file-saver';

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
  canEdit = true; // set to false if the request is inactive
  isLoading = false;
  userType: string;
  private requestSub: Subscription;
  private commentsSub: Subscription;

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
          return this.commentsService.fetchComments(this.requestId).pipe(
            map(comments => {
              this.comments = comments;
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

  ionViewWillEnter() {
    this.commentsSub = this.commentsService.comments.subscribe(comments => {
      this.comments = comments;
    });
  }

  onSelectFile(fileUrl: string) {
    let downloadFile;
    this.alertController.create({
      header: 'Download',
      message: 'Do you wish to download this attachment?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.attachmentsService.downloadAttachment(fileUrl)
              .subscribe(resData => {
                console.log(resData.body);
                const blob = new Blob([resData.body], { type: 'image/jpeg' } );
                FileSaver.saveAs(blob);
              });
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
    if (this.commentsSub) {
      this.commentsSub.unsubscribe();
    }
  }

}
