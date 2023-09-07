import { Component, OnInit, OnChanges, EventEmitter, Input, Output } from "@angular/core";
import { CalendarEvent, CalendarMonthViewBeforeRenderEvent, CalendarUtils, CalendarView, DAYS_OF_WEEK } from "angular-calendar";
import { Subject } from "rxjs";
import { CalendarUtilsService } from "../calendarUtils/calendar-utils.service";
import { EventItem } from "./models/calendar.model";

@Component({
    selector: 'app-calendar-view',
    templateUrl: './calendar-view.component.html',
    styleUrls: ['./calendar-view.component.scss'],
    providers: [
        {
            provide: CalendarUtils,
            useClass: CalendarUtilsService,
        },
    ],
})

export class CalendarViewComponent implements OnInit, OnChanges {
    @Input() viewDate!: Date;
    @Input() events: any[] = [];
    @Input() skeleton = true;

    @Output() dayClickedOutput = new EventEmitter<any>();

    view: CalendarView = CalendarView.Month;
    calendarView = CalendarView;
    weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
    activeDayIsOpen = false;
    refresh: Subject<any> = new Subject();
    calendarEvents: EventItem[] = [];
    renderEvent!: CalendarMonthViewBeforeRenderEvent;
    holidayCalendarEvents: CalendarEvent[] = [];

    constructor(
    ) { }

    ngOnInit(): void {
        const that = this;
        setTimeout(() => {
            that.skeleton = false;
        }, 1000);
    }
    ngOnChanges(): void {
        return;
    }

    beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
        this.renderEvent = renderEvent;
        setTimeout(() => this.renderEventsHolidays(), 100);
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }, calendar: any): void {
        console.log('Day clicked', { date, events });
        console.log('Event en día -> ', calendar);
        this.dayClickedOutput.emit({ date, events });
        // if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        //   this.activeDayIsOpen = false;
        // } else {
        //   this.activeDayIsOpen = true;
        // }
        this.viewDate = date;
    }

    handleEvent(event: CalendarEvent): void {
        console.log('Event clicked', event);
    }

    private renderEventsHolidays() {
        let isHoliday: boolean;
        if (this.renderEvent !== undefined) {
            this.renderEvent.body.forEach((day) => {
                const dayOfMonth = day.date.getDate();
                const month = day.date.getMonth();
                const year = day.date.getFullYear();
                isHoliday = false;
                this.holidayCalendarEvents.forEach((event: CalendarEvent) => {
                    if (dayOfMonth === event.start.getDate() &&
                        month === event.start.getMonth() && year === event.start.getFullYear() && day.inMonth) {
                        isHoliday = true;
                    }
                });
                if (isHoliday) {
                    day.cssClass = 'bg-holiday';
                } else {
                    day.cssClass = '';
                }
            });
        }
    }
}