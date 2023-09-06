import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDateFormat',
})
export class CustomDateFormatPipe implements PipeTransform {
  transform(value: Date): string {
    if (value) {
      const date = new Date(value);
      const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const day = daysOfWeek[date.getDay()];
      const dayOfMonth = date.getDate();
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      let daySuffix = 'th';
      if (dayOfMonth === 1 || dayOfMonth === 21 || dayOfMonth === 31) {
        daySuffix = 'st';
      } else if (dayOfMonth === 2 || dayOfMonth === 22) {
        daySuffix = 'nd';
      } else if (dayOfMonth === 3 || dayOfMonth === 23) {
        daySuffix = 'rd';
      }

      return `${day}, ${dayOfMonth}${daySuffix} ${month} ${year}`;
    } else {
      return '';
    }
  }
}
