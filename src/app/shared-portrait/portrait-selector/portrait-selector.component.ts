import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
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

  constructor(private platform: Platform, private imageUtilityService: ImageUtilService) { }

  ngOnInit() {
    // console.log('Mobile: ', this.platform.is('mobile'));
    // console.log('Hybrid: ', this.platform.is('hybrid'));
    // console.log('Desktop: ', this.platform.is('desktop'));
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
      correctOrientation: false,
      width: 600,
      resultType: CameraResultType.DataUrl,
    })
    .then(image => {
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
    console.log(event);
    const chosenFile = (event.target as HTMLInputElement).files[0];
    if (!chosenFile) {
      // TODO - add alert
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.imageUtilityService.getOrientation(chosenFile, (orientation) => {
        // if orientation is 1 or absent from exif data, no problem..
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

}
