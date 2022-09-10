import { ColumnOrder } from "../types/ColumnOrder";

export class ReorderColumnsDto {
  taskId: number
  sourceColumn: ColumnOrder;
  destinationColumn: ColumnOrder;
}