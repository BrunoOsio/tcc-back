const TASK_ORDER_SEPARATOR = ' ';
export const formatTaskIdsOrderWhenTaskCreated = (taskIdsOrder: string | undefined, newTaskId: number): string => {
  const newTaskIdsOrder = String(TASK_ORDER_SEPARATOR + newTaskId);

  const order = !taskIdsOrder
    ? newTaskIdsOrder.trim()
    : taskIdsOrder.concat(newTaskIdsOrder).trim();
  
  return order;
}