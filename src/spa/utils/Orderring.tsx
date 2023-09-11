export function calcNewOrder(
  sourceId: number,
  destinationId: number,
  orders: number[]
) {
  if (sourceId < destinationId) destinationId += 1;

  let prevItemOrder = destinationId == 0 ? 0 : orders[destinationId - 1];

  let nextItemOrder =
    destinationId == orders.length
      ? orders[orders.length - 1] + 2000 // Create a new order 2000 after the max if moving item at the end
      : orders[destinationId];

  let newOrder = (prevItemOrder + nextItemOrder) / 2;

  return newOrder;
}
