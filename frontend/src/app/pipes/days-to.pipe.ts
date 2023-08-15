import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysTo',
})
export class DaysToPipe implements PipeTransform {
  transform(targetDate: Date): string {
    const today = new Date();
    targetDate = new Date(targetDate);
    const timeDifference = targetDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (daysDifference === 1) {
      return 'In 1 day';
    } else if (daysDifference > 1) {
      return `In ${daysDifference} days`;
    } else {
      return 'Today';
    }
  }
}
