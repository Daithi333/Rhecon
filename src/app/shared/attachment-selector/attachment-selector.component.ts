import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';

import { AttachmentsService } from '../attachments.service';
import { fileTypes } from '../file-types';
import { ImageUtilService } from '../../shared-portrait/image-util-service';

@Component({
  selector: 'app-attachment-selector',
  templateUrl: './attachment-selector.component.html',
  styleUrls: ['./attachment-selector.component.scss'],
})
export class AttachmentSelectorComponent implements OnInit {
  useFileSelector = false;
  @ViewChild('fileSelector') fileSelector: ElementRef<HTMLInputElement>;
  @ViewChild('fileSelector2') fileSelector2: ElementRef<HTMLInputElement>;
  @Output() attachmentChoice = new EventEmitter<string | File>();
  @Input() selectedAttachments: string[] = [];
  @Input() requestId: number;
  chosenAttachmentType: string;

  constructor(
    private platform: Platform,
    private attachmentsService: AttachmentsService,
    private alertController: AlertController,
    private imageUtilityService: ImageUtilService
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

  onSelectFile() {
    this.fileSelector2.nativeElement.click();
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
      this.chosenAttachmentType = chosenFile.type;
      const dataUrl = fr.result.toString();
      // if attachment is an image, may need re-orientated due to EXIF orientation
      if (chosenFile.type.substr(0, 5) === 'image') {
        this.correctImageOrientation(chosenFile, dataUrl);
      } else {
        this.selectedAttachments.push(dataUrl);
        console.log(this.selectedAttachments);
      }
      this.attachmentChoice.emit(chosenFile);
    };
    fr.readAsDataURL(chosenFile);
  }

  // Method to allow user to delete a file from request upon clicking it
  onClickFile(requestId: number, attachmentUrl: string) {
    this.alertController.create({
      header: 'Choose action',
      message: 'Please choose an action for this attachment.',
      buttons: [
        {
          text: 'Remove',
          handler: () => {
            // delete from server if it is already uploaded, else just delete from local list
            if (attachmentUrl.substr(0, 20) === 'http://davidmcelhill') {
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

  isNewAttachment(url: string) {
    return url.substring(0, 4) === 'data' ? true : false;
  }

  /**
   * To choose icon for file preview section if not an image
   * @param url - url for file on remote storage
   */
  choosepreviewIcon(url: string) {
    const ext = url.substring(url.lastIndexOf('.') + 1, url.length);
    const fileType =  fileTypes.find(f => f.ext === ext);
    if (fileType.mime.substring(0, 5) === 'image') {
      return url;
    }
    if (!fileType) {
      return '../../assets/icon/document_icon.png';
    }
    return fileType.icon;
  }

  /**
   * To choose an icon for newly attached file if not an image
   * @param url - url is base64 string
   */
  choosepreviewIconNew(url: string) {
    const mime = url.substring(url.lastIndexOf(':') + 1, url.lastIndexOf(';'));
    if (mime.substring(0, 5) === 'image') {
      return url;
    }
    const fileType =  fileTypes.find(f => f.mime === mime);
    if (!fileType) {
      return '../../assets/icon/document_icon.png';
    }
    return fileType.icon;

  }

  // method to delete attachment record from server
  private deleteAttachment(requestId: number, attachmentUrl: string) {
    let attachmentId;
    this.attachmentsService.getAttachment(requestId, attachmentUrl)
    .subscribe(attachment => {
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

  private correctImageOrientation(chosenFile: File, dataUrl: string) {
    this.imageUtilityService.getOrientation(chosenFile, (orientation) => {
      // if orientation is 1 or absent from exif data, no action required
      if (+orientation === 1 || +orientation === -1) {
        this.selectedAttachments.push(dataUrl);
      // if orientation is anything else, it needs reorientated
      } else {
        this.imageUtilityService.resetOrientation(dataUrl, orientation, (reorientatedImage) => {
          const reorientatedDataUrl = reorientatedImage;
          this.selectedAttachments.push(reorientatedDataUrl);
        });
      }
    });
  }

}
