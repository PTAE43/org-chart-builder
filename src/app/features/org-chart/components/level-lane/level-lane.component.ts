import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { OrgNode } from '../../../../core/models/org-node.model';

@Component({
    selector: 'app-level-lane',
    templateUrl: './level-lane.component.html',
})
export class LevelLaneComponent {
    @Input() level = 0;
    @Input() nodes: OrgNode[] = [];
    @Input() hoveredNodeId: number | null = null;

    @Output() deleteNode = new EventEmitter<OrgNode>();
    @Output() hoverNode = new EventEmitter<OrgNode>();
    @Output() nodeDropped = new EventEmitter<CdkDragDrop<OrgNode[]>>();

    onDrop(event: CdkDragDrop<OrgNode[]>): void {
        this.nodeDropped.emit(event);
    }
}


/**
ทุก Level เป็น cdkDropList
card จาก Positions panel เป็น cdkDrag โดยผูก cdkDragData ใส่ { type: 'position', position }
เวลา drop ใน level >>> เช็คก่อนว่าเป็น drag type ไหน
 */