import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Position } from '../models/position.model';
import { OrgNode } from '../models/org-node.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrgChartService {
    constructor(private api: ApiService) { }

    getPositions(): Observable<Position[]> {
        return this.api.get<Position[]>('/positions');
    }

    createPosition(payload: { code: string; name: string }): Observable<Position> {
        return this.api.post<Position>('/positions', payload);
    }

    getOrgNodes(): Observable<OrgNode[]> {
        return this.api.get<OrgNode[]>('/org');
    }

    createOrgNode(payload: {
        positionId: number;
        level: number;
        parentNodeId?: number | null;
    }): Observable<OrgNode> {
        return this.api.post<OrgNode>('/org', payload);
    }

    deleteOrgNode(id: number): Observable<void> {
        return this.api.delete<void>(`/org/${id}`);
    }
}

//รวมทุกอย่างเกี่ยวกับ org chart ไว้ที่ service เดียว เวลาเปลี่ยน API/DB แก้ที่นี่ที่เดียว