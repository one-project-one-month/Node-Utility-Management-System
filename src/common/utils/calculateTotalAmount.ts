import { CreateBillType, UpdateBillType } from '../../validations/billSchema';

export const calculateTotalAmount = (
  data: Partial<CreateBillType | UpdateBillType>
) => {
  const feeKeys = [
    'rental_fee',
    'electricity_fee',
    'water_fee',
    'service_fee',
    'ground_fee',
    'car_parking_fee',
    'wifi_fee',
    'fine_fee',
  ] as const;

  return feeKeys.reduce((sum, key) => sum + (data[key] || 0), 0);
};
