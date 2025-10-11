import moment from 'moment';
import { CreateBillType } from '../../validations/billSchema';
import prisma from '../../lib/prismaClient';

export const genetatedRentalFee = async (data: CreateBillType) => {
  const contract = await prisma.contract.findUnique({
    where: {
      room_id: data.room_id,
      expiry_date: { gt: moment(Date.now()).toDate() },
    },
    include: { contract_type: true },
  });

  const generatedRentalFee = contract?.contract_type?.price as
    | string
    | undefined;
  const generatedData =
    generatedRentalFee !== undefined
      ? {
          rental_fee: Number(generatedRentalFee),
          ...(({ rental_fee, ...rest }) => rest)(data),
        }
      : { ...data };

  return { generatedData, generatedRentalFee };
};
