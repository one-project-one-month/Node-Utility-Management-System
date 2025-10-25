export const TOTAL_UNIT_FLATTENER_CONFIG = {
  id: 'id',
  electricityUnits: 'electricityUnits',
  waterUnits: 'waterUnits',
  updatedAt: 'updatedAt',
  createdAt: 'createdAt',
  billId: 'billId',
  roomId: 'bill.room.id',
  roomNo: 'bill.room.roomNo',
  floor: 'bill.room.floor',
  roomStatus: 'bill.room.status',
  tenantName: 'bill.room.tenant.name',
};

const genericFlattener = (rawObject: object, config: object) => {
  const flatObject: any = {};

  for (const [newKey, path] of Object.entries(config)) {
    const keys = path.split('.');

    const value = keys.reduce((current: any, key: string) => {
      return current?.[key];
    }, rawObject);

    flatObject[newKey] = value ?? null;
  }

  return flatObject;
};

export const universalFlattener = (
  rawData: Array<object>,
  config: object
): Array<object> => {
  if (!Array.isArray(rawData)) {
    rawData = [rawData];
  }

  return rawData.map((item) => genericFlattener(item, config));
};
