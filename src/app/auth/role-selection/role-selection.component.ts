import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { map, mergeMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { HttpService, SpecialismData, UserTypeData } from '../../shared-http/http.service';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss'],
})
export class RoleSelectionComponent implements OnInit, OnDestroy {
  specialisms: SpecialismData[] = [];
  userTypes: UserTypeData[] = [];
  form: FormGroup;
  isLoading = true;
  specialismsSub: Subscription;
  selectedRole: number;
  isConsultant = false;

  constructor(
    private modalController: ModalController,
    private httpService: HttpService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.specialismsSub = this.httpService.fetchSpecialisms()
      .pipe(
        mergeMap(specialismData => {
          this.specialisms = specialismData;
          return this.httpService.fetchUserTypes().pipe(
            map(userTypeData => {
              this.userTypes = userTypeData;
            })
          );
        })
      )
      .subscribe(() => {
        this.isLoading = false;
      },
      error => {
        this.alertController.create({
          header: 'Error',
          message: 'Could not retrieve data, please try again shortly.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
              }
            }
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      });

    this.form = new FormGroup({
      role: new FormControl(null, {
        validators: [Validators.required]
      }),
      specialism: new FormControl('1', {
        validators: [Validators.required]
      })
    });

  }

  onRoleChosen(event: any) {
    if (+event.detail.value === 4 || +event.detail.value === 6) {
      this.isConsultant = true;
    } else {
      this.isConsultant = false;
      this.form.patchValue({ specialism: '1' });
    }
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
      'proceed',
      'role-selection'
    );
  }

  ngOnDestroy() {
    if (this.specialismsSub) {
      this.specialismsSub.unsubscribe();
    }
  }
}
