import { ColumnOrder } from "../types/ColumnOrder";

export class ReorderColumnsDto {
  sourceColumn: ColumnOrder;
  destinationColumn: ColumnOrder;
}