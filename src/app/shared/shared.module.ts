import { NgModule } from "@angular/core";
import { ListComponent } from "./components/list/list.component";
import { ListEventsPipe } from "./pipes/list-events.pipe";

@NgModule({
    declarations: [
        ListComponent,
        ListEventsPipe
    ],
    exports: [
        ListEventsPipe
    ]
})
export class SharedModule { }