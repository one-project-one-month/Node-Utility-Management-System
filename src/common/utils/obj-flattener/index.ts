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

export * from './invoiceConfig';
export * from './totalUnitsConfig';
