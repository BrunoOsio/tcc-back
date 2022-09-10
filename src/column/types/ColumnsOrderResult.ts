import { ColumnOrder } from "./ColumnOrder"

export type ColumnsOrderResult = {
  taskId: number
  sourceColumn: ColumnOrder,
  destinationColumn: ColumnOrder
}