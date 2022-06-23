import { AuthService } from 'src/app/shared/auth.service';
import { ScheduleService } from './../../services/schedule.service';
import { Schedule } from './../../shared/interfaces';
import { ModalPopoverPage } from './../modal-popover/modal-popover.page';
import { ModalController } from '@ionic/angular';
import { CurrentUser } from './../../shared/auth';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  currentUser = <CurrentUser>{};
  modalData: any;
  schedules: Schedule[] = [];
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private modal: ModalController, private scheduleService: ScheduleService, private authService: AuthService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.currentUser.id = params.get('id');
      this.currentUser.email = params.get('email');
      this.currentUser.name = params.get('name');
    });

    this.loadSchedules();
  }

  loadSchedules() {
    if (this.schedules.length === 0) {
      this.scheduleService.getAll().subscribe((res) => {

        console.log(res);

        this.schedules = res.map((schedule: Schedule) => {

          this.loading = false;

          return <Schedule>{
            id: schedule.id,
            status: schedule.status,
            daily: schedule.daily,
            weekly: schedule.weekly,
            monthly: schedule.monthly,
            custom: schedule.custom,
            times: schedule.times,
            instructions: schedule.instructions,
            medication: schedule.medication
          };
        });
      });
    }
  }

  async openIonModal() {
    const modal = await this.modal.create({
      component: ModalPopoverPage,
      componentProps: {
        modalTitle: 'New Reminder',
      },
    });

    modal.onDidDismiss().then((modelData) => {
      if (modelData !== null) {
        this.modalData = modelData.data;
        setTimeout(() => { this.modalData = ''; }, 10000);
      }
    });
    return await modal.present();
  }

  logout(){
    this.authService.logout();
  }
}
