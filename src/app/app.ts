import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgChartPageComponent } from './features/org-chart/pages/org-chart-page/org-chart-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    OrgChartPageComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App { }
