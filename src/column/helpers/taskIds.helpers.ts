const TASK_ORDER_SEPARATOR = ' ';
export const formatTaskIdsOrderWhenTaskCreated = (taskIdsOrder: string | undefined, newTaskId: number): string => {
  const newTaskIdsOrder = String(TASK_ORDER_SEPARATOR + newTaskId);

  const order = !taskIdsOrder
    ? newTaskIdsOrder.trim()
    : taskIdsOrder.concat(newTaskIdsOrder).trim();
  
  return order;
}

export const formatTaskIdsOrderToString = (taskIdsOrder: number[]): string | null => {
  const taskIds = taskIdsOrder
    .map(id => String(id))
    .join(TASK_ORDER_SEPARATOR);

  if(!taskIds) return null;  

  return taskIds;
}

export const destructTaskIdsToArray = (taskIdsOrder: string): number[] => {
  const taskIds = taskIdsOrder.split(TASK_ORDER_SEPARATOR)
  .map(id => Number(id));

  return taskIds;
}