import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';

@Component({
  selector: 'app-portrait-selector',
  templateUrl: './portrait-selector.component.html',
  styleUrls: ['./portrait-selector.component.scss'],
})
export class PortraitSelectorComponent implements OnInit {
  useFileSelector = false;
  @ViewChild('fileSelector') fileSelector: ElementRef<HTMLInputElement>;
  @Output() imageChoice = new EventEmitter<string | File>();
  selectedImage = 'http://goldenayeyarwaddytravels.com/sites/default/files/default_images/default-user-icon-8.jpg';

  constructor(private platform: Platform) { }

  ngOnInit() {
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.useFileSelector = true;
    }
  }

  onSelectImage() {
    // open camera only if device has one
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl
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

  onFileChosen() {

  }

}
