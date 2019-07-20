import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';
import { ImageUtilService } from '../image-util-service';

@Component({
  selector: 'app-portrait-selector',
  templateUrl: './portrait-selector.component.html',
  styleUrls: ['./portrait-selector.component.scss'],
})
export class PortraitSelectorComponent implements OnInit {
  useFileSelector = false;
  @ViewChild('fileSelector') fileSelector: ElementRef<HTMLInputElement>;
  @Output() imageChoice = new EventEmitter<string | File>();
  @Input() selectedImage: string;

  constructor(
    private platform: Platform,
    private imageUtilityService: ImageUtilService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    if (
      // platform is mobile and hybrid, it is a browser emulating a mobile
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      // TODO - action sheet to allow choice of camera or file chooser on non-mobile device with camera
      this.useFileSelector = true;
    }
  }

  onSelectImage() {
    // if camera plugin is unavailable, use file selector
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
      // reorientate if not 1 or -1
      this.selectedImage = image.dataUrl;
      this.imageChoice.emit(image.dataUrl);
    })
    .catch(error => {
      console.log('Error: ' + error);
      if (this.useFileSelector) {
        this.fileSelector.nativeElement.click();
      }
      return false;
    });
  }

  onFileChosen(event: Event) {
    const chosenFile = (event.target as HTMLInputElement).files[0];
    if (!chosenFile) {
      this.presentAlert();
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.imageUtilityService.getOrientation(chosenFile, (orientation) => {
        // if orientation is 1 or absent from exif data, no action required
        if (+orientation === 1 || +orientation === -1) {
          this.selectedImage = dataUrl;
          this.imageChoice.emit(chosenFile);
        // if orientation is anything else, it needs reorientated
        } else {
          this.imageUtilityService.resetOrientation(dataUrl, orientation, (reorientatedImage) => {
            const reorientatedDataUrl = reorientatedImage;
            this.selectedImage = reorientatedDataUrl;
            this.imageChoice.emit(reorientatedDataUrl);
          });
        }
      });
    };
    fr.readAsDataURL(chosenFile);
  }

  private presentAlert() {
    this.alertController.create({
      header: 'Error',
      message: 'There has been a problem with your file selection. Please try again later.',
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
