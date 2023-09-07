import { Injectable } from '@angular/core';
import { endOfMonth, subWeeks, startOfMonth, addWeeks, getWeeksInMonth, startOfWeek, lastDayOfWeek } from 'date-fns';
import { CalendarUtils } from 'angular-calendar';
import { GetMonthViewArgs, MonthView } from 'calendar-utils';

@Injectable({
  providedIn: 'root'
})
export class CalendarUtilsService extends CalendarUtils {

  override getMonthView(args: GetMonthViewArgs): MonthView {
    const weeks = getWeeksInMonth(args.viewDate, { weekStartsOn: 1 });
    let moreWeeks = 0;
    if (weeks === 5) { moreWeeks = 1; }
    if (weeks === 4) {
      moreWeeks = 1;
      args.viewStart = startOfWeek(subWeeks(startOfMonth(args.viewDate), moreWeeks), { weekStartsOn: 1 });
    }
    args.viewEnd = lastDayOfWeek(addWeeks(endOfMonth(args.viewDate), moreWeeks), { weekStartsOn: 1 });
    return super.getMonthView(args);
  }
}
