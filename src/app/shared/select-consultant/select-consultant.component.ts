import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { User } from '../../consultants/user.model';
import { UsersService } from '../../consultants/users.service';

@Component({
  selector: 'app-select-consultant',
  templateUrl: './select-consultant.component.html',
  styleUrls: ['./select-consultant.component.scss'],
})
export class SelectConsultantComponent implements OnInit, OnDestroy {
  consultants: User[];
  isLoading = false;
  private consultantsSub: Subscription;

  constructor(private modalController: ModalController, private usersService: UsersService) { }

  ngOnInit() {
    this.consultantsSub = this.usersService.users
      .subscribe(consultants => {
        this.consultants = consultants;
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.usersService.users.subscribe(() => {
      this.isLoading = false;
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'consultantSelect');
  }

  onConsultantSelect(selectedConsultant: User) {
    this.modalController.dismiss(selectedConsultant, 'cancel', 'consultantSelect');
  }

  ngOnDestroy() {
    if (this.consultantsSub) {
      this.consultantsSub.unsubscribe();
    }
  }

}
