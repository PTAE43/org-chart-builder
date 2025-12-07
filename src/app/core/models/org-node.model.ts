import { Position } from './position.model';

export interface OrgNode {
  id: number;
  positionId?: number;
  level: number;
  parentNodeId?: number | null;
  position?: Position;
  children?: OrgNode[];
}
