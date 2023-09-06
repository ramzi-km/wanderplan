import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateFormat2',
})
export class CustomDateFormat2Pipe implements PipeTransform {
  transform(value: Date): string {
    if (value) {
      const date = new Date(value);
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const day = daysOfWeek[date.getDay()];
      const dayOfMonth = date.getDate();
      const month = date.getMonth() + 1; // Months are zero-based, so add 1
      const year = date.getFullYear();

      return `${day} ${dayOfMonth}/${month}`;
    } else {
      return '';
    }
  }
}
