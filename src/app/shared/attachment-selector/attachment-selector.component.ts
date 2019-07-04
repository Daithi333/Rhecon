import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';

import { AttachmentsService } from '../../requests/attachments.service';

@Component({
  selector: 'app-attachment-selector',
  templateUrl: './attachment-selector.component.html',
  styleUrls: ['./attachment-selector.component.scss'],
})
export class AttachmentSelectorComponent implements OnInit {
  useFileSelector = false;
  @ViewChild('fileSelector') fileSelector: ElementRef<HTMLInputElement>;
  @Output() attachmentChoice = new EventEmitter<string | File>();
  @Input() selectedAttachments: string[] = [];
  @Input() requestId: number;

  constructor(
    private platform: Platform,
    private attachmentsService: AttachmentsService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      // TODO - add action sheet to allow choice of camera or file chooser on non-mobile device with cam attached
      this.useFileSelector = true;
    }
  }

  onSelectImage() {
    // check to open file selector if camera unavailable
    if (!Capacitor.isPluginAvailable('Camera') || this.useFileSelector) {
      this.fileSelector.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 60,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 600,
      resultType: CameraResultType.DataUrl,
    })
    .then(image => {
      this.selectedAttachments.push(image.dataUrl);
      console.log(this.selectedAttachments);
      this.attachmentChoice.emit(image.dataUrl);
    })
    .catch(error => {
      console.log('Error: ' + error);
      if (this.useFileSelector) {
        this.fileSelector.nativeElement.click();
      }
      return false;
    });

  }

  onSelectVideo() {

  }

  onSelectDoc() {

  }

  onSelectAudio() {

  }
  // Method to Extract file from the hidden HTML input's file selection event
  onAttachmentChosen(event: Event) {
    const chosenFile = (event.target as HTMLInputElement).files[0];
    if (!chosenFile) {
      // TODO - add alert
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      // convert to string to allow preview
      const dataUrl = fr.result.toString();
      this.selectedAttachments.push(dataUrl);
      console.log(this.selectedAttachments);
      this.attachmentChoice.emit(chosenFile);
    };
    fr.readAsDataURL(chosenFile);
  }

  // Method to allow user to download or delete a file from request upon clicking it
  onClickFile(requestId: number, attachmentUrl: string) {
    this.alertController.create({
      header: 'Choose action',
      message: 'Please choose an action for this attachment.',
      buttons: [
        {
          text: 'Download',
          handler: () => {
            // TODO - trigger file download from server
          }
        },
        {
          text: 'Delete',
          handler: () => {
            // delete from server if it is already uploaded, else just delete from local list
            if (attachmentUrl.substr(0, 24) === 'http://dmcelhill01.lampt') {
              this.deleteAttachment(requestId, attachmentUrl);
            } else {
              this.selectedAttachments = this.selectedAttachments.filter(a => a !== attachmentUrl);
            }
          }
        },
        {
          text: 'Back'
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  // method to delete attachment record from server
  private deleteAttachment(requestId: number, attachmentUrl: string) {
    let attachmentId;
    this.attachmentsService.getAttachment(requestId, attachmentUrl)
    .subscribe(attachment => {
      console.log('Retrieved Attachment: ' + attachment);
      attachmentId = attachment.id;
      this.alertController.create({
        header: 'Confirm',
        message: 'Are you sure you wish to delete this attachment?',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.attachmentsService.deleteAttachment(attachmentId).subscribe(() => {
                this.selectedAttachments = this.selectedAttachments.filter(a => a !== attachmentUrl);
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
    });
  }

}
