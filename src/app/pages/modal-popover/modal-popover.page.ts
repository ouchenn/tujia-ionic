import { ScheduleService } from './../../services/schedule.service';
import { MedicationService } from './../../services/medication.service';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Medication } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-modal-popover',
  templateUrl: './modal-popover.page.html',
  styleUrls: ['./modal-popover.page.scss'],
})
export class ModalPopoverPage implements OnInit {
  @Input() modalTitle: string;
  reminderForm: FormGroup;
  medication: Medication;
  medications: Medication[] = [];
  counter: number = 0;

  currentStep: string;

  constructor(
    private modal: ModalController,
    private fb: FormBuilder,
    private medService: MedicationService,
    private scheduleService: ScheduleService
  ) {
    this.reminderForm = this.fb.group({
      status: [''],
      daily: [''],
      weekly: [''],
      monthly: [''],
      custom: [[]],
      times: [[]],
      instructions: [''],
      medication: [''],
    });
  }

  ngOnInit() {
    this.loadMeds();
    this.currentStep = 'pick-med-occ';
  }

  async closeModal() {
    const close: string = 'Reminder has been set !';
    this.reminderForm.reset();
    await this.modal.dismiss(close);
  }

  loadMeds() {
    if (this.medications.length === 0) {
      this.medService.getAll().subscribe((res) => {

        this.medications = res.map((med: Medication) => {
          return <Medication>{
            id: med.id,
            name: med.name,
            company: med.company,
            diagnosis: med.diagnosis,
            serial: med.serial,
            type: med.type,
          };
        });
      });
    }
  }

  onMedSelect(e) {
    this.reminderForm.controls['medication'].setValue(e.detail.value);
  }

  onoccurrenceSelect(e) {
    let occurrence: string = e.detail.value;

    this.reminderForm.controls['daily'].setValue(false);
    this.reminderForm.controls['weekly'].setValue(false);
    this.reminderForm.controls['monthly'].setValue(false);

    if (occurrence) this.reminderForm.controls[`${occurrence}`].setValue(true);
  }

  plusTimesFields() {
    ++this.counter;

    let ionItem = document.createElement("ion-item");
    let label = document.createElement("ion-label");
    let time = document.createElement("ion-input");

    ionItem.className = "input-grp";

    label.innerHTML = "Set Time " + this.counter;
    label.className = "label";

    time.type = "time";
    time.name = "toTakeAt";
    time.className = "input input-time";

    ionItem.appendChild(label)
    ionItem.appendChild(time);

    document.getElementById("times").appendChild(ionItem);
  }

  minusTimesFields() {
    if (this.counter > 0) {
      --this.counter;
      let select = document.getElementById('times');
      select.removeChild(select.lastChild);
    }
  }

  setTimes() {
    const times = document.getElementsByName("toTakeAt");
    let timesArr = [];

    times.forEach((e: HTMLInputElement) => {
      timesArr.push(e.value);
    });

    this.reminderForm.controls['times'].setValue(timesArr);
  }

  changeStep(currentStep: string, direct: 'forward' | 'back') {
    switch (currentStep) {
      case 'pick-med-occ':
        if (direct === 'forward') {
          this.currentStep = 'pick-time';
        }
        break;

      case 'pick-time':
        if (direct === 'back') {
          this.currentStep = 'pick-med-occ';
          this.counter = 0;
        }
        break;
    }
  }

  saveReminder() {
    this.reminderForm.controls['status'].setValue("ACTIVE");

    this.setTimes();
    this.scheduleService.save(this.reminderForm.value);
    this.closeModal();
  }
}
