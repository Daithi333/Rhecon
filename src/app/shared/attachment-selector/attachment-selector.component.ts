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

  onSelectFile(requestId: number, attachmentUrl: string) {
    let attachmentId;
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
            // add conditional for when image was only added locally
            this.attachmentsService.getAttachment(requestId, attachmentUrl)
            .subscribe(attachment => {
              console.log('Retrieved Attachment: ' + attachment);
              attachmentId = attachment.id;
              this.alertController.create({
                header: 'Confirm',
                message: 'Are you sure you wish to delete this attachment?.',
                buttons: [
                  {
                    text: 'Yes',
                    handler: () => {
                      this.attachmentsService.deleteAttachment(attachmentId).subscribe();
                      // TODO - refresh view so attachment preview drops off (like when one is added)
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
        },
        {
          text: 'Back'
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

}
