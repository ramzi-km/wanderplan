import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateRange',
})
export class DateRangePipe implements PipeTransform {
  transform(dateRange: Date[] | string[]): String {
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);

    const startDay = startDate.getDate();
    const startMonth = startDate.toLocaleString('default', { month: 'short' });

    const endDay = endDate.getDate();
    const endMonth = endDate.toLocaleString('default', { month: 'short' });

    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  }
}
