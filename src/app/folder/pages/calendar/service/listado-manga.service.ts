import { Injectable } from "@angular/core";
import { HttpResponse } from '@capacitor-community/http';
import { URL_BASE } from "src/app/core/config/restapi.config";
import { CapacitorHttp } from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})
export class ListadoMangaService {
    constructor() {
    }

    async getCalendar(month?: string, year?: string) {
        const options = {
            url: `${URL_BASE}?mes=${month}&ano=${year}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVkNzEzZTJmYzEwNjNiMjNmMGYyM2I2YyIsIm5hbWUiOiJBcnlhIFN0YXJrdCIsImVtYWlsIjoiYXJ5YUBnb3QuY29tIiwiYXZhdGFyIjoiYXYtNS5wbmcifSwiaWF0IjoxNTY4MjE2NzIzLCJleHAiOjE1NzA4MDg3MjN9.v3fT2MQEN_xy47Y19E4BqBJ_fmX8khmOg8H74SBgezM'
            }
        };

        const response: HttpResponse = await CapacitorHttp.get(options).then((resp) => {
            return resp.data;
        }
        );
        return response;
    }
}