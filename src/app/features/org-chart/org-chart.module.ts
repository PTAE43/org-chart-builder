import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

import { OrgChartPageComponent } from './pages/org-chart-page/org-chart-page.component';
import { LevelLaneComponent } from '../org-chart/components/level-lane/level-lane.component';
import { NodeCardComponent } from './components/node-card/node-card.component';

@NgModule({
    declarations: [
        OrgChartPageComponent,
        LevelLaneComponent,
        NodeCardComponent,
    ],
    imports: [
        CommonModule,
        DragDropModule,
        MatDialogModule,
        ReactiveFormsModule,
    ],
})
export class OrgChartModule { }
