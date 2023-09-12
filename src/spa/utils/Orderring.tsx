import { DraggableLocation } from "@hello-pangea/dnd";

export const OrderIncrement = 1000;

export type Orderable = { order: number };

export function calcNewOrder<T extends Orderable>(
  sourceIsMovingDestinationDown: boolean,
  destinationId: number,
  bucket: T[]
) {
  if (sourceIsMovingDestinationDown) destinationId += 1;

  // If destination is first item, we simulate a fake order of destination / 4 instead of zero to reduce the tendency of orders toward zero
  let prevItemOrder =
    destinationId == 0
      ? bucket[destinationId].order / 4
      : bucket[destinationId - 1].order;

  // If destination is last item, we generate a fake order of 2 times the increment for the same reason
  let nextItemOrder =
    destinationId == bucket.length
      ? bucket[bucket.length - 1].order + 2 * OrderIncrement
      : bucket[destinationId].order;

  let newOrder = (prevItemOrder + nextItemOrder) / 2;

  // Failover just in case to get back on a usable state
  if (!newOrder || newOrder == 0) {
    newOrder = OrderIncrement + Math.random();
  }

  return newOrder;
}

// This function help defining the new order and new subvalues of an item being moved in a DraggableArea.
// The use case is for when you have multiple list (for ex.: categories) of the same type of items, and that
// inside a single list, those items are themselves sorted by some criteria (subvalues), then by an order number
// dragAndDropGeneric will do the all the hard calculations and call an itemUpdater with the new order and subvalues
export function dragAndDropGeneric<T extends Orderable>(
  {
    source,
    destination,
  }: {
    source: DraggableLocation;
    destination: DraggableLocation | null;
  },
  droppablesData: { [key: string]: T[] },
  subValueAccessors: { [key: string]: (arg0: T) => any },
  itemUpdater: (
    source: DraggableLocation,
    destination: DraggableLocation,
    sourceItem: T,
    newOrder: number,
    newSubvalues: { [key: string]: any }
  ) => void
) {
  if (
    !destination ||
    (destination.droppableId == source.droppableId &&
      destination.index == source.index)
  ) {
    return;
  }

  // Shortcuts
  let sourceItem = droppablesData[source.droppableId][source.index];
  let droppablesDataDestination = droppablesData[destination.droppableId];

  // If we move a task to the last position of a perProjectAndDone, the destination task will not exist, so we use the last task as a reference
  let destinationIsEndOfDroppable =
    destination.index >= droppablesDataDestination.length;

  // We get destination item reference for subvalues infos, we use last item of dropablesData as reference is the new position is after the end
  let destinationItem = destinationIsEndOfDroppable
    ? droppablesDataDestination[droppablesDataDestination.length - 1]
    : droppablesDataDestination[destination.index];

  // If source item is in same bucket as destination, and if source if before destination, then the destination item will move up in the list after the reorder, we have to take it into account
  let sourceIsMovingDestinationDown =
    source.droppableId == destination.droppableId &&
    source.index < destination.index;

  // We get the taskId surrounding or "englobing" the destination position, so we can ensure later that we only update source sub-values if they are different from both
  let itemEnglobingDestinationIndex = sourceIsMovingDestinationDown
    ? destination.index + 1
    : destination.index - 1;

  // If this is the first or last item of dropableData, we consider englobing task to be = destination task
  let itemEnglobingDestination: T;
  if (
    itemEnglobingDestinationIndex <= 0 ||
    itemEnglobingDestinationIndex >= droppablesDataDestination.length
  ) {
    itemEnglobingDestination = destinationItem;
  } else {
    itemEnglobingDestination =
      droppablesDataDestination[itemEnglobingDestinationIndex];
  }

  // Calculating new subvalues
  let newSubValues: { [key: string]: any } = {};

  Object.keys(subValueAccessors).forEach((subValueKey) => {
    let getValue = subValueAccessors[subValueKey];

    // We deduce the subvalue to which we must assign the task, we try to preserve original subvalue if possible
    newSubValues[subValueKey] = getValue(sourceItem);
    if (
      getValue(itemEnglobingDestination) !== getValue(sourceItem) &&
      getValue(destinationItem) !== getValue(sourceItem)
    ) {
      // If we change value, we always get the upper value
      newSubValues[subValueKey] = getValue(
        sourceIsMovingDestinationDown
          ? destinationItem
          : itemEnglobingDestination
      );
    }
  });

  const areSubValuesEquals = (
    item: T,
    subvalues: { [key: string]: any }
  ): boolean => {
    let allEquals = true;

    Object.keys(subvalues).forEach((key) => {
      let getValue = subValueAccessors[key];

      if (subvalues[key] !== getValue(item)) {
        allEquals = false;
      }
    });

    return allEquals;
  };

  // Bucket = Part of the droppableData that share the same subValues
  // We identify the start of the bucket of items where the item is moving
  let destinationBucketIdStart = droppablesData[
    destination.droppableId
  ].findIndex((item) => areSubValuesEquals(item, newSubValues));

  let inBucketDestinationIndex = destination.index - destinationBucketIdStart;

  let destinationBucket = droppablesDataDestination.filter((item) =>
    areSubValuesEquals(item, newSubValues)
  );

  let newOrder = calcNewOrder(
    sourceIsMovingDestinationDown,
    inBucketDestinationIndex,
    destinationBucket
  );

  itemUpdater(source, destination, sourceItem, newOrder, newSubValues);
}
