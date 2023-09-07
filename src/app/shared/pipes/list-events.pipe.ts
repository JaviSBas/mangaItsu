import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'listEvents'
})
export class ListEventsPipe implements PipeTransform {

	transform(value: any[], date: Date | null): any[] {
		if (date) {
			return value.filter(item => item.date instanceof Date && new Date(item.date).toDateString() === new Date(date).toDateString());
		} else {
			return value;
		}
	}
}
