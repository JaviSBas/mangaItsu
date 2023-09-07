import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarViewComponent } from './calendar-view.component';

@NgModule({
    declarations: [
        CalendarViewComponent,
    ],
    imports: [
        CommonModule,
        IonicModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
    ],
    exports: [
        CalendarViewComponent,
    ]
})

export class CalendarViewModule { }
