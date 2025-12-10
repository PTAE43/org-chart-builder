import { CommonModule } from '@angular/common';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OrgNode } from '../../../../core/models/org-node.model';
import { NodeCardComponent } from '../node-card/node-card.component';

@Component({
  selector: 'app-level-lane',
  standalone: true,
  imports: [CommonModule, DragDropModule, NodeCardComponent],
  templateUrl: './level-lane.component.html',
  styleUrls: ['./level-lane.component.scss'],
})
export class LevelLaneComponent {
  @Input() level!: number;
  @Input() nodes: OrgNode[] = [];
  @Input() hoveredNodeId: number | null = null;

  @Output() nodeDropped = new EventEmitter<CdkDragDrop<OrgNode[]>>();
  @Output() deleteNode = new EventEmitter<OrgNode>();
  @Output() hoverNode = new EventEmitter<OrgNode | null>();

  onDrop(event: CdkDragDrop<OrgNode[]>): void {
    this.nodeDropped.emit(event);
  }

  onDelete(node: OrgNode): void {
    this.deleteNode.emit(node);
  }

  onHover(node: OrgNode | null): void {
    this.hoverNode.emit(node);
  }
}
