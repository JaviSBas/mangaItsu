import { Component, OnInit } from '@angular/core';
import { ListadoMangaService } from "./service/listado-manga.service";
import { endOfDay, startOfDay } from 'date-fns';

import * as moment from 'moment';
import * as _ from 'lodash';
import { DateNavigator, EventItem, LegendItem, Publication, PublishHousePublications } from './calendar-view/models/calendar.model';
import { COLORS, DAYS, MONTHS } from 'src/app/core/config/constants';
import { IonChip } from '@ionic/angular';

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendarDate: Date = new Date();
  dayClicked!: Date | null;
  publishHouseLegend: Array<LegendItem> = [];

  loading = true;

  datedList: Array<PublishHousePublications> = [];
  datedListBackup: Array<PublishHousePublications> = [];
  calendarEvents: Array<EventItem> = [];
  list: any = null;
  eventsList: Array<any> = [];

  publishHouseSelected: Array<string> = [];

  dateNavigator: DateNavigator = {
    currentMonth: '',
    nextMonth: '',
    previousMonth: ''
  };
  publicationsList!: Publication[];

  constructor(
    private listadoMangaService: ListadoMangaService
  ) {
    moment.locale('es');
  }

  ngOnInit(): void {
    this.getCalendarData(this.calendarDate);
  }

  handleEditorialClick(item: LegendItem, chip: IonChip, e: Event) {
    e.preventDefault();
    e.stopPropagation();
    chip.outline = !chip.outline;
    if (this.publishHouseSelected.findIndex((house: string) => house === item.publishHouse) === -1) {
      this.publishHouseSelected = [...this.publishHouseSelected, item.publishHouse!];
    } else {
      this.publishHouseSelected = this.publishHouseSelected.filter((house: string) => house !== item.publishHouse);
    }
    this.filterListByPublish();
  }

  handleDayClicked({ date, events }: { date: Date, events: any[] }) {
    const monthClicked = moment(date).month();
    const currentMonth = moment(this.calendarDate).month();

    this.calendarDate = date;
    new Date(this.dayClicked!).toDateString() === new Date(date).toDateString() ? this.dayClicked = null : this.dayClicked = date;
  }

  handleMonthNavigatorClick(month: string) {
    this.loading = true;
    const tMonth = MONTHS.findIndex((m: string) => m === month);
    if (tMonth === 0 && this.dateNavigator.currentMonth.split(" ")[0] === MONTHS[11]) {
      this.calendarDate = new Date(this.calendarDate.getFullYear() + 1, tMonth, 1);
    }
    if (tMonth === 11 && this.dateNavigator.currentMonth.split(" ")[0] === MONTHS[0]) {
      this.calendarDate = new Date(this.calendarDate.getFullYear() - 1, tMonth, 1);
    }
    this.calendarDate = new Date(this.calendarDate.getFullYear(), tMonth, 1);
    this.getCalendarData(this.calendarDate);
  }

  formatDate(date: string | Date): string {
    return date instanceof Date ? moment(date).format('LL') : date;
  }

  private getCalendarData(calendar: Date) {
    const [month, year] = [(calendar.getMonth() + 1).toString(), calendar.getFullYear().toString()]
    this.listadoMangaService.getCalendar(month, year)
      .then((response: any) => {
        this.scrapHtmlResponse(response);
      })
      .catch((error: any) => {
        console.log('error: ', error);
      })
  }

  private scrapHtmlResponse(data: any) {
    this.publishHouseLegend = [];
    let publishHouseArray: PublishHousePublications[] = [];
    // obtener el elemento body del html
    const htmlEl = new DOMParser().parseFromString(String(data), 'text/html').getElementsByTagName('body')[0].querySelectorAll('table');
    let tIndex = 0;
    let currentEditorial = '';
    htmlEl.forEach(
      (item: any, i) => {
        if (item.classList.contains('ventana_id1')) {
          let entityObj: PublishHousePublications = {
            date: new Date(),
            publications: [],
            publishHouse: ''
          };
          // montar objeto para navegación de meses y editoriales / fecha
          item.querySelectorAll('h2').forEach((element: any, index: number) => {
            if (i === 3) {
              switch (index) {
                case 0:
                  this.dateNavigator.previousMonth = element.innerText.trim().split(" ")[0];
                  break;
                case 1:
                  this.dateNavigator.currentMonth = `${element.innerText.trim().split(" ")[2]} ${element.innerText.trim().split(" ")[3]}`;
                  break;
                case 2:
                  this.dateNavigator.nextMonth = element.innerText.trim().split(" ")[0];
                  break;
              }
            } else if (i > 3) {
              if (!DAYS.includes(element.innerText.split(',')[0]) &&
                !MONTHS.includes(element.innerText.split(' ')[0])) {
                entityObj.publishHouse = element.innerText.trim();
                if (this.publishHouseLegend.findIndex((item: LegendItem) => item.publishHouse === entityObj.publishHouse) === -1) {
                  this.publishHouseLegend = [...this.publishHouseLegend, {
                    publishHouse: entityObj.publishHouse, color: COLORS[entityObj.publishHouse as keyof typeof COLORS] ?
                      COLORS[entityObj.publishHouse as keyof typeof COLORS].graph : 'assets/custom_icons/grafico_bolita_default.svg'
                  }];
                }
                currentEditorial = entityObj.publishHouse!;
              } else {
                if (!MONTHS.includes(element.innerText.split(' ')[0])) {
                  if (element.innerText.includes('Agosto')) {
                    element.innerText = element.innerText.replace('Agosto', 'August');
                  }
                  if (element.innerText.includes('Abril')) {
                    element.innerText = element.innerText.replace('Abril', 'April');
                  }
                  if (element.innerText.includes('Enero')) {
                    element.innerText = element.innerText.replace('Enero', 'January');
                  }
                  entityObj.date = new Date(element.innerText);
                } else {
                  entityObj.date = element.innerText
                }
              }
              if (index === 1) {
                publishHouseArray = [...publishHouseArray, entityObj];
              }
            }
          });
        }
        if ((item.classList && item.classList.length > 0 && item.classList[0] !== 'ventana_id1' &&
          item.classList[0].startsWith('ventana_id')) ||
          (item.classList[0] === 'ventana_id1' && item.querySelectorAll('a') && item.querySelectorAll('a').length > 0 && i > 3)) {
          if (currentEditorial !== publishHouseArray[tIndex].publishHouse) {
            tIndex++;
          }
          item.querySelectorAll('a').forEach((a: any) => {
            if (publishHouseArray[tIndex].publications) {
              if (publishHouseArray[tIndex].publications.findIndex((p: any) => p.id === a['href'].split('=')[1]) !== -1) {
                publishHouseArray[tIndex].publications.find((p: any) => p.id === a['href'].split('=')[1])!.title = a['innerText'];
              } else {
                let publication: Publication = {
                  id: '',
                  img: '',
                };
                publication.id = a['href'].split('=')[1];
                if (a.querySelectorAll('img')) {
                  a.querySelectorAll('img').forEach((img: any) => {
                    const src = img.getAttribute('data-portada') ? `https://static.listadomanga.com/${img.getAttribute('data-portada')}` : img['src'];
                    publication.img = src;
                  });
                }
                publishHouseArray[tIndex].publications =
                  [...publishHouseArray[tIndex].publications, publication];
              }
            } else {
              publishHouseArray[tIndex].publications = [];
              const publication: any = {};
              publication.id = a['href'].split('=')[1];
              if (a.querySelectorAll('img')) {
                a.querySelectorAll('img').forEach((img: any) => {
                  const src = img.getAttribute('data-portada') ? `https://static.listadomanga.com/${img.getAttribute('data-portada')}` : img['src'];
                  publication.img = src;
                });
              }
              publishHouseArray[tIndex].publications =
                [...publishHouseArray[tIndex].publications, publication];
            }
          });
        }
      });
    publishHouseArray.forEach((item: PublishHousePublications) => {
      if (item.publications && item.publications.length > 0) {
        item.publications = item.publications.filter((p: Publication) => p.img);
      }
    });
    this.list = publishHouseArray;
    this.mapData();
    this.datedListBackup = _.cloneDeep(this.eventsList);
    this.mapEvents(this.eventsList);
    this.loading = false;
  }

  private mapEvents(events: any[]) {
    setTimeout(() => {
      this.calendarEvents = [];
      events.forEach(item => {
        item.publications.forEach((p: any) => {
          if (item.date instanceof Date) {
            if (this.calendarEvents.length === 0 ||
              this.calendarEvents.findIndex(c => new Date(c.start).toDateString() === new Date(item.date).toDateString() && c.publishHouse === p.editorial) === -1) {
              this.calendarEvents.push({
                start: startOfDay(item.date),
                title: '',
                end: endOfDay(item.date),
                color: COLORS[p.editorial as keyof typeof COLORS],
                allDay: true,
                publishHouse: p.editorial
              });
            }
          }
        });
      });
    }, 500);
  }

  private mapData() {
    let tIndex: number = 0;
    this.eventsList = [];
    this.list.forEach(
      (item: PublishHousePublications) => {
        if (this.eventsList[tIndex] && new Date(this.eventsList[tIndex].date!).toDateString() !== new Date(item.date!).toDateString()) {
          tIndex++;
          this.eventsList[tIndex] = {
            date: null,
            publications: []
          }
          this.eventsList[tIndex].date = item.date;
          if (item.publications && item.publications.length > 0) {
            item.publications.forEach(
              (p: Publication) => {
                const pObj: {
                  id: string,
                  img: string,
                  publishHouse: string,
                  title: string
                } = {
                  id: p.id,
                  img: p.img,
                  publishHouse: item.publishHouse!,
                  title: p.title!
                };
                this.eventsList[tIndex].publications = [...this.eventsList[tIndex].publications, pObj];
              }
            );
          }
        } else {
          if (this.eventsList[tIndex] === null || this.eventsList[tIndex] === undefined) {
            this.eventsList[tIndex] = {
              date: null,
              publications: []
            }
            this.eventsList[tIndex].date = item.date;
          }
          if (item.publications && item.publications.length > 0) {
            item.publications.forEach(
              (p: Publication) => {
                const pObj: {
                  id: string,
                  img: string,
                  publishHouse: string,
                  title: string
                } = {
                  id: p.id,
                  img: p.img,
                  publishHouse: item.publishHouse!,
                  title: p.title!
                };
                this.eventsList[tIndex].publications = [...this.eventsList[tIndex].publications, pObj];
              }
            );
          }
        }
      }
    );
  }

  private filterListByPublish() {
    console.log(this.eventsList);
    console.log(this.datedListBackup);
    this.loading = true;
    let tList: PublishHousePublications[] = [];
    setTimeout(() => {
      if (this.publishHouseSelected.length) {
        this.eventsList = [];
        this.datedListBackup.forEach((item: PublishHousePublications) => {
          let publishObj: PublishHousePublications = {
            date: item.date,
            publications: []
          };
          this.publishHouseSelected.forEach((publishHouse: string) => {
            if (item.publications.findIndex((p: Publication) => p.publishHouse === publishHouse) !== -1) {
              publishObj.publications = [...publishObj.publications, ...item.publications.filter((p: Publication) => p.publishHouse === publishHouse)];
            }
          });
          tList = [...tList, publishObj];
        });
        console.log("lista filtrada: ", tList);
        this.eventsList = tList.filter((item: PublishHousePublications) => item.publications.length);
      } else {
        this.eventsList = this.datedListBackup;
      }
      this.loading = false;
    }, 1000);
  }
}