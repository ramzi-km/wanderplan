import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker, MatDatepickerInput } from '@angular/material/datepicker';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss'],
})
export class CreatePlanComponent implements OnInit {
  today!: Date | string;
  @ViewChild('picker') picker!: MatDatepicker<any>;
  constructor() {}
  openDatePicker() {
    this.picker.open();
  }
  ngOnInit(): void {
    this.today = new Date();
  }

}
