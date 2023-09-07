import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PAGES } from './config/config';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  readonly PAGES = PAGES;
  folder!: string;
  page!: string;
  private activatedRoute = inject(ActivatedRoute);

  constructor() { }

  ngOnInit() {
    this.page = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.folder = `${this.page.charAt(0).toUpperCase()}${this.page.slice(1)}`;
  }
}
