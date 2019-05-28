import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { Consultant } from 'src/app/consultants/consultant.model';
import { ConsultantsService } from 'src/app/consultants/consultants.service';

@Component({
  selector: 'app-select-consultant',
  templateUrl: './select-consultant.component.html',
  styleUrls: ['./select-consultant.component.scss'],
})
export class SelectConsultantComponent implements OnInit, OnDestroy {
  consultants: Consultant[];
  private consultantsSub: Subscription;

  constructor(private modalController: ModalController, private consultantsService: ConsultantsService) { }

  ngOnInit() {
    this.consultantsSub = this.consultantsService.consultants
      .subscribe(consultants => {
        this.consultants = consultants;
      });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'consultantSelect');
  }

  onConsultantSelect() {
    this.modalController.dismiss(null, 'cancel', 'consultantSelect');
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const consultantId = form.value.selectedConsultant;
    console.log(consultantId);
  }

  ngOnDestroy() {
    if (this.consultantsSub) {
      this.consultantsSub.unsubscribe();
    }
  }

}
