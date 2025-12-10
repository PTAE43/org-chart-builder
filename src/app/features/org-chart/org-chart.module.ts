import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

import { OrgChartPageComponent } from './pages/org-chart-page/org-chart-page.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DragDropModule,
        MatDialogModule,
        ReactiveFormsModule,

        OrgChartPageComponent,
    ],
    exports: [
        OrgChartPageComponent,
    ],
})
export class OrgChartModule { }
