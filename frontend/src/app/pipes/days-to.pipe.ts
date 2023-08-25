import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysTo',
})
export class DaysToPipe implements PipeTransform {
  transform(targetDate: Date | string): string {
    const today = new Date();
    targetDate = new Date(targetDate);
    const timeDifference = targetDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (daysDifference === 1) {
      return 'In a day';
    } else if (daysDifference > 1) {
      return `In ${daysDifference} days`;
      // } else if (daysDifference == 0) {
      //   return 'Today';
    } else {
      return 'ongoing';
    }
  }
}
