import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ApiService } from '../../../../core/services/api.service';
import { OrgNode } from '../../../../core/models/org-node.model';
import { Position } from '../../../../core/models/position.model';

import { HttpErrorResponse } from '@angular/common/http';

export interface OrgNodeDialogResult {
    mode: 'create' | 'update';
    node: OrgNode;
    parentId: number | null;
}

@Component({
    selector: 'app-org-chart-page',
    templateUrl: './org-chart-page.component.html',
    styleUrls: ['./org-chart-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgChartPageComponent implements OnInit {
    positions: Position[] = [];
    rootNodes: OrgNode[] = [];
    isLoading = false;
    errorMessage = '';

    constructor(
        private readonly api: ApiService,
        private readonly dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.isLoading = true;

        this.api
            .get<{ positions: Position[]; tree: OrgNode[] }>('/org-chart')
            .subscribe({
                next: (response) => {
                    this.positions = response.positions;
                    this.rootNodes = response.tree;
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

    handleDrop(event: CdkDragDrop<OrgNode[]>): void {
        if (event.previousIndex === event.currentIndex) {
            return;
        }

        const list = event.container.data;

        moveItemInArray(list, event.previousIndex, event.currentIndex);
        // this.api.post<void, { orderedIds: number[] }>(
        //   '/org-chart/reorder-root',
        //   { orderedIds: list.map(node => node.id) }
        // ).subscribe();
    }

    openCreateNodeDialog(parentId: number | null): void {
        const dialogRef = this.dialog.open<unknown, { parentId: number | null }, OrgNodeDialogResult>(undefined as never,
            {
                data: { parentId },
            }
        );

        dialogRef.afterClosed().subscribe((result: OrgNodeDialogResult | undefined) => {
            if (!result) return;

            if (result.mode === 'create') {
                this.createNode(result.node, result.parentId);
            } else {
                this.updateNode(result.node);
            }
        });
    }

    private createNode(node: OrgNode, parentId: number | null): void {
        this.api
            .post<OrgNode, { node: OrgNode; parentId: number | null }>('/org-chart/nodes', {
                node,
                parentId,
            })
            .subscribe(() => {
                this.loadData();
            });
    }

    private updateNode(node: OrgNode): void {
        this.api
            .post<OrgNode, OrgNode>(`/org-chart/nodes/${node.id}`, node)
            .subscribe(() => {
                this.loadData();
            });
    }
}


/*
<p *ngIf="errorMessage" class="text-red-600">
  {{ errorMessage }}
</p>
*/