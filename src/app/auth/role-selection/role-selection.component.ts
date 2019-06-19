import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SignupComponent } from '../signup/signup.component';
import { HttpService, SpecialismData } from '../../shared-http/http.service';
import { Specialism } from 'src/app/consultants/specialism.enum';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss'],
})
export class RoleSelectionComponent implements OnInit {
  specialisms: SpecialismData[] = [];
  form: FormGroup;
  isLoading = true;

  constructor(private modalController: ModalController, private httpService: HttpService) { }

  ngOnInit() {
    this.isLoading = true;
    this.httpService.fetchSpecialisms()
    .pipe(
      map(resData => {
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            this.specialisms.push({
              id: +resData[key].id,
              specialism: resData[key].specialism
            });
          }
        }
      })
    ).subscribe(() => {
      this.isLoading = false;
    });

    this.form = new FormGroup({
      role: new FormControl(null, {
        validators: [Validators.required]
      }),
      specialism: new FormControl(null, {
        validators: [Validators.required]
      })
    });

  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'role-selection');
  }

  onProceed() {
    this.modalController.dismiss(
      {
        chosenRole: this.form.value.role,
        chosenSpecialism: this.form.value.specialism
      },
      'cancel',
      'role-selection'
    );
  }
}
