import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
    PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
    CdkDragDrop,
    DragDropModule,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../../../core/services/api.service';
import { OrgNode } from '../../../../core/models/org-node.model';
import { Position } from '../../../../core/models/position.model';
import { LevelLaneComponent } from '../../components/level-lane/level-lane.component';

export interface OrgNodeDialogResult {
    mode: 'create' | 'update';
    node: OrgNode;
    parentId: number | null;
}

interface OrgChartResponse {
    positions: Position[];
    tree: OrgNode[];
}

@Component({
    selector: 'app-org-chart-page',
    standalone: true,
    imports: [CommonModule, DragDropModule, LevelLaneComponent],
    templateUrl: './org-chart-page.component.html',
    styleUrls: ['./org-chart-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartPageComponent implements OnInit {
    positions: Position[] = [];
    rootNodes: OrgNode[] = [];
    lanes: { level: number; nodes: OrgNode[] }[] = [];

    hoveredNodeId: number | null = null;
    isLoading = false;
    errorMessage = '';

    constructor(
        private readonly api: ApiService,
        private readonly dialog: MatDialog,
        @Inject(PLATFORM_ID) private readonly platformId: object,
    ) { }

    ngOnInit(): void {
        // กันไม่ให้เรียก API ตอน prerender/SSR
        if (isPlatformBrowser(this.platformId)) {
            this.loadData();
        }
    }

    private loadData(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.api.get<OrgChartResponse>('/org-chart').subscribe({
            next: (response) => {
                this.positions = response.positions;
                this.rootNodes = response.tree;
                this.rebuildLanes();
                this.isLoading = false;
            },
            error: (error: HttpErrorResponse) => {
                this.isLoading = false;
                this.errorMessage =
                    (error.error && (error.error.message as string | undefined)) ??
                    'โหลดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';

                console.error('Load org chart failed:', error);
            },
        });
    }

    private rebuildLanes(): void {
        const lanesMap = new Map<number, OrgNode[]>();

        const visit = (node: OrgNode): void => {
            const level = node.level;
            const list = lanesMap.get(level) ?? [];
            list.push(node);
            lanesMap.set(level, list);

            node.children?.forEach(visit);
        };

        this.rootNodes.forEach(visit);

        this.lanes = Array.from(lanesMap.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([level, nodes]) => ({ level, nodes }));
    }

    handleDrop(event: CdkDragDrop<OrgNode[]>): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }

        const list = event.container.data;
        moveItemInArray(list, event.previousIndex, event.currentIndex);
        this.rebuildLanes();

        // API /org-chart/reorder-root
    }

    onHoverNode(node: OrgNode | null): void {
        this.hoveredNodeId = node ? node.id : null;
    }

    onDeleteNode(node: OrgNode): void {
        this.api.delete<void>(`/org-chart/nodes/${node.id}`).subscribe({
            next: () => this.loadData(),
            error: (error: HttpErrorResponse) => {
                console.error('Delete node failed:', error);
                this.errorMessage =
                    (error.error && (error.error.message as string | undefined)) ??
                    'ลบ node ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
            },
        });
    }

    openCreateNodeDialog(parentId: number | null): void {
        // ไว้ทำ dialog สร้าง/แก้ไข node ภายหลัง
        void parentId; // กัน unused variable ชั่วคราว
    }
}
