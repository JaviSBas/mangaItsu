import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarViewModule } from "./calendar/calendar-view/calendar-view.module";
import { CalendarComponent } from "./calendar/calendar.component";

@NgModule({
    declarations: [
        CalendarComponent
    ],
    imports: [
        SharedModule,
        CalendarViewModule,
        IonicModule,
        CommonModule,
    ],
    exports: [
        CalendarComponent
    ]
})
export class PagesModule { }