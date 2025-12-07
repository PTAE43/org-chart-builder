import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrgNode } from '../../../../core/models/org-node.model';

@Component({
    selector: 'app-node-card',
    templateUrl: './node-card.component.html',
    styleUrls: ['./node-card.component.scss'],
})
export class NodeCardComponent {
    @Input() node!: OrgNode;
    @Input() isHighlighted = false;

    @Output() delete = new EventEmitter<OrgNode>();
    @Output() hover = new EventEmitter<OrgNode | null>();

    onDeleteClick(event: MouseEvent): void {
        event.stopPropagation();
        this.delete.emit(this.node);
    }

    onMouseEnter(): void {
        this.hover.emit(this.node);
    }

    onMouseLeave(): void {
        this.hover.emit(null);
    }
}