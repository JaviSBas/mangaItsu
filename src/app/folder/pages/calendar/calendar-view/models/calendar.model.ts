import { CalendarEvent } from 'angular-calendar';
import { EventColor } from 'calendar-utils';

export class EventItem implements CalendarEvent {
    start!: Date;
    end!: Date;
    title!: string;
    date?: Date;
    color!: EventColor;
    publishHouse?: string;
    allDay!: true;
}

export interface DateNavigator {
    previousMonth: string;
    currentMonth: string;
    nextMonth: string;
}

export interface PublishHousePublications {
    date: Date | null;
    publishHouse?: string;
    publications: Publication[];
}

export interface Publication {
    id: string;
    img: string;
    publishHouse?: string;
    title?: string;
}

export interface LegendItem {
    publishHouse?: string;
    color?: string;
}