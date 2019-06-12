import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';
import { AttachmentsService } from 'src/app/requests/attachments.service';

@Component({
  selector: 'app-attachment-selector',
  templateUrl: './attachment-selector.component.html',
  styleUrls: ['./attachment-selector.component.scss'],
})
export class AttachmentSelectorComponent implements OnInit {
  useFileSelector = false;
  @ViewChild('fileSelector') fileSelector: ElementRef<HTMLInputElement>;
  @Output() attachmentChoices = new EventEmitter<string[] | File[]>();
  selectedAttachments: string[] = [
    'https://mymodernmet.com/wp/wp-content/uploads/2018/10/Mou-Aysha-portrait-photography-3.jpg',
  ];

  constructor(private platform: Platform, private attachmentsService: AttachmentsService) {}

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
      allowEditing: true,
      quality: 60,
      source: CameraSource.Prompt,
      correctOrientation: false,
      width: 600,
      resultType: CameraResultType.DataUrl,
    })
    .then(image => {
      this.selectedAttachments.push(image.dataUrl);
      console.log(this.selectedAttachments);
      this.attachmentChoices.emit(this.selectedAttachments);
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
  // Method to Extract file from the input's file selection event
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
      this.attachmentChoices.emit(this.selectedAttachments);
    };
    fr.readAsDataURL(chosenFile);
  }

}
