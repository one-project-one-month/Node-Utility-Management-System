import { Request } from 'express';
import { BadRequestError, NotFoundError } from '../common/errors';
import { generatePaginationData } from '../common/utils/paginationHelper';
import prisma from '../lib/prismaClient';
import {
  CreateBillSchemaType,
  GetAllBillQueryType,
  UpdateBillSchemaType,
} from '../validations/newBillsSchema';
import { PaginationQueryType } from '../validations/paginationSchema';
import {
  mailOptionConfig,
  mailSend,
} from '../common/utils/mail-service/resendMailTransporter';
import { Bill, Invoice, Room, TotalUnits } from '../../generated/prisma';

// define rate constants (cost per unit)
const ELECTRICITY_RATE = 500;
const WATER_RATE = 300;

// Utility: generate random number within range
const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Utility: generate random due date (7-30 days from now, but always after contract start)
const randomDate = (contractStartDate: Date) => {
  const startDate = new Date(contractStartDate);
  const now = new Date();

  // Generate a due date 7-30 days from now
  const daysUntilDue = Math.floor(Math.random() * 24) + 7; // Random between 7-30 days
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + daysUntilDue);

  // Ensure the due date is never before the contract start date
  if (dueDate < startDate) {
    // If calculated due date is before contract start, set it to a few days after contract start
    const adjustedDueDate = new Date(startDate);
    adjustedDueDate.setDate(adjustedDueDate.getDate() + daysUntilDue);
    return adjustedDueDate;
  }

  return dueDate;
};

const mailBodyGenerator = (
  name: string,
  room: Room,
  bill: Bill,
  invoice: Invoice,
  totalUnits: TotalUnits
) => {
  const htmlContent = `<p>Dear ${name},</p>
      <p>Here is the bill for Room No: ${room.roomNo}:</p>
      <ul>
        <li><strong>Room Number:</strong> ${room.roomNo}</li>
        <li><strong>Floor:</strong> ${room.floor}</li>
        <li><strong>Invoice No:</strong> ${invoice.invoiceNo}</li>
        <li><strong>Due Date:</strong> ${bill.dueDate}</li>
        <li><strong>Rental Fee:</strong> ${bill.rentalFee} Kyats</li>
        <li><strong>Electricity Fee:</strong> ${bill.electricityFee} Kyats</li>
        <li><strong>Electricity Unit:</strong> ${totalUnits.electricityUnits} Units</li>
        <li><strong>Water Fee:</strong> ${bill.waterFee} Kyats</li>
        <li><strong>Water Unit:</strong> ${totalUnits.waterUnits} Units</li>
        <li><strong>Wifi Fee:</strong> ${bill.wifiFee} Kyats</li>
        <li><strong>Fine Fee:</strong> ${bill.fineFee} Kyats</li>
        <li><strong>Ground Fee:</strong> ${bill.groundFee} Kyats</li>
        <li><strong>Car Parking Fee:</strong> ${bill.carParkingFee} Kyats</li>
        <li><strong>Total Amount:</strong> ${bill.totalAmount} Kyats</li>
      </ul>
      <p>If you have any questions, feel free to contact us.</p>
      <p>Best regards,<br/>Nest Flow Team</p>
    `;
  return htmlContent;
};

export const autoGenerateBillsService = async () => {
  // Fetch all rooms with status 'Rented'
  const rooms = await prisma.room.findMany({
    where: {
      status: 'Rented',
    },
    include: {
      tenant: true,
    },
  });

  // Generate bills for each room
  for (const room of rooms) {
    // Reuse createBillService with minimal data
    const { bill, invoice, totalUnits } = await createBillService({
      roomId: room.id,
    });

    // Email sending logic to notify tenants about their new bills
    // Prepare mail body
    const tenantName = room.tenant!.name;
    const tenantEmail = room.tenant!.email;
    const htmlContent = mailBodyGenerator(
      tenantName,
      room,
      bill,
      invoice,
      totalUnits
    );

    // prepare mail data
    const mailOptions = mailOptionConfig({
      name: tenantName,
      to: process.env.MAIL_HOST || tenantEmail,
      subject: 'Your Bill for this month',
      htmlContent: htmlContent,
    });

    // Send email
    await mailSend(mailOptions);
  }
  return rooms.length;
};

export const createBillService = async (data: CreateBillSchemaType) => {
  const {
    roomId,
    rentalFee,
    electricityFee,
    waterFee,
    fineFee,
    serviceFee,
    groundFee,
    carParkingFee,
    wifiFee,
    dueDate,
  } = data;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      contract: {
        include: {
          contractType: true,
        },
        orderBy: {
          createdDate: 'desc', // Get the most recent contract first
        },
      },
    },
  });

  if (!room) throw new NotFoundError('Room not found');
  if (!room.contract || room.contract.length === 0) {
    throw new NotFoundError('No contract found for this room');
  }

  // Get the current/most recent contract
  const currentContract = room.contract[0];

  // Generate random data if missing
  const rent = rentalFee ?? Number(currentContract.contractType.price);
  const randomElectricity = electricityFee ?? randomNumber(5000, 30000);
  const randomWater = waterFee ?? randomNumber(3000, 15000);
  const randomFine = fineFee ?? randomNumber(0, 2000);
  const randomService = serviceFee ?? randomNumber(1000, 5000);
  const randomGround = groundFee ?? randomNumber(500, 1500);
  const randomParking = carParkingFee ?? randomNumber(1000, 4000);
  const randomWifi = wifiFee ?? randomNumber(1000, 3000);

  const totalAmount =
    (rentalFee || rent) +
    (electricityFee || randomElectricity) +
    (waterFee || randomWater) +
    (fineFee || randomFine) +
    (serviceFee || randomService) +
    (groundFee || randomGround) +
    (carParkingFee || randomParking) +
    (wifiFee || randomWifi);

  const electricityUnit = (randomElectricity / ELECTRICITY_RATE).toFixed(2);
  const waterUnit = (randomWater / WATER_RATE).toFixed(2);

  const bill = await prisma.bill.create({
    data: {
      roomId,
      rentalFee: rentalFee || rent,
      electricityFee: electricityFee || randomElectricity,
      waterFee: waterFee || randomWater,
      fineFee: fineFee || randomFine,
      serviceFee: serviceFee || randomService,
      groundFee: groundFee || randomGround,
      carParkingFee: carParkingFee || randomParking,
      wifiFee: wifiFee || randomWifi,
      totalAmount,
      dueDate: new Date(dueDate ?? randomDate(currentContract.createdDate)),
    },
  });

  const totalUnits = await prisma.totalUnits.create({
    data: {
      bill: { connect: { id: bill.id } },
      electricityUnits: Number(electricityUnit),
      waterUnits: Number(waterUnit),
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      bill: { connect: { id: bill.id } },
      status: 'Pending',
      invoiceNo: `INV-${crypto.randomUUID().split('-')[0].toUpperCase()}`,
      receipt: {
        create: {
          paymentMethod: 'Cash',
          paidDate: null,
        },
      },
    },
  });

  return { bill, invoice, totalUnits };
};

export const updateBillsService = async (
  billId: string,
  data: UpdateBillSchemaType
) => {
  const {
    roomId,
    rentalFee,
    electricityFee,
    waterFee,
    fineFee,
    serviceFee,
    groundFee,
    carParkingFee,
    wifiFee,
    dueDate,
  } = data;

  // check if bill exists
  const existingBill = await prisma.bill.findUnique({
    where: { id: billId },
    include: { room: true },
  });
  if (!existingBill) throw new NotFoundError('Bill not found');

  if (roomId !== existingBill.room.id) {
    throw new BadRequestError('Room ID mismatch with existing bill');
  }

  const toNumber = (value: any) => (value ? Number(value) : 0);

  // Utility fallback to existing or new value
  const valueOrExisting = (newVal: number | undefined, oldVal: number) =>
    newVal !== undefined ? newVal : oldVal;

  // Recalculate all amounts safely
  const newRental = valueOrExisting(
    rentalFee,
    toNumber(existingBill.rentalFee)
  );
  const newElectric = valueOrExisting(
    electricityFee,
    toNumber(existingBill.electricityFee)
  );
  const newWater = valueOrExisting(waterFee, toNumber(existingBill.waterFee));
  const newFine = valueOrExisting(fineFee, toNumber(existingBill.fineFee));
  const newService = valueOrExisting(
    serviceFee,
    toNumber(existingBill.serviceFee)
  );
  const newGround = valueOrExisting(
    groundFee,
    toNumber(existingBill.groundFee)
  );
  const newParking = valueOrExisting(
    carParkingFee,
    toNumber(existingBill.carParkingFee)
  );
  const newWifi = valueOrExisting(wifiFee, toNumber(existingBill.wifiFee));

  const totalAmount =
    newRental +
    newElectric +
    newWater +
    newFine +
    newService +
    newGround +
    newParking +
    newWifi;

  const electricityUnit = Number((newElectric / ELECTRICITY_RATE).toFixed(2));
  const waterUnit = Number((newWater / WATER_RATE).toFixed(2));

  const updatedBill = await prisma.$transaction(async (tx) => {
    // update bill
    const bill = await tx.bill.update({
      where: { id: billId },
      data: {
        rentalFee: newRental,
        electricityFee: newElectric,
        waterFee: newWater,
        fineFee: newFine,
        serviceFee: newService,
        groundFee: newGround,
        carParkingFee: newParking,
        wifiFee: newWifi,
        totalAmount,
        dueDate: dueDate ? new Date(dueDate) : existingBill.dueDate,
      },
    });

    // update TotalUnits
    await tx.totalUnits.update({
      where: { billId },
      data: {
        electricityUnits: electricityUnit,
        waterUnits: waterUnit,
      },
    });

    return bill;
  });

  return updatedBill;
};

export const getBillsByIdService = async (billId: string) => {
  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    include: {
      room: {
        include: {
          tenant: true,
          contract: {
            include: {
              contractType: true,
            },
          },
        },
      },
      totalUnit: true,
      invoice: {
        include: {
          receipt: true,
        },
      },
    },
  });
  if (!bill) throw new NotFoundError('Bill not found');

  return bill;
};

export const getAllBillsService = async (req: Request) => {
  // Calculate pagination
  const { page, limit, status, roomNo, tenantName, search } =
    req.validatedQuery as GetAllBillQueryType;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (status) {
    whereClause.invoice = {
      is: {
        status: status,
      },
    };
  }

  if (roomNo || tenantName) {
    whereClause.room = {
      is: {},
    };

    if (roomNo) {
      whereClause.room.is!.roomNo = Number(roomNo);
    }

    if (tenantName) {
      whereClause.room.is!.tenant = {
        is: {
          name: {
            contains: tenantName,
            mode: 'insensitive',
          },
        },
      };
    }
  }

  // universal search -> query params [tenant name and roomNo]
  const searchString = search?.toString();

  if (searchString) {
    const searchNumber = isNaN(Number(searchString))
      ? undefined
      : Number(searchString);
    const OR_conditions: any[] = [];

    // For RoomNo
    if (searchNumber !== undefined) {
      OR_conditions.push({
        room: {
          is: {
            roomNo: searchNumber,
          },
        },
      });
    } else {
      // For Tenant Name
      OR_conditions.push({
        room: {
          is: {
            tenant: {
              is: {
                name: {
                  contains: searchString,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      });
    }

    // OR will only be applied if search param is provided
    if (OR_conditions.length > 0) {
      whereClause.OR = OR_conditions;
    }
  }

  const [bills, totalCount] = await prisma.$transaction([
    prisma.bill.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      where: whereClause,
      include: {
        room: {
          include: {
            tenant: true,
            contract: {
              include: {
                contractType: true,
              },
            },
          },
        },
        totalUnit: true,
        invoice: {
          include: {
            receipt: true,
          },
        },
      },
    }),
    prisma.bill.count({
      where: whereClause,
    }),
  ]);

  if (Array.isArray(bills) && !bills.length)
    throw new NotFoundError('Bills not found');

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return { data: bills, ...paginationData };
};

export const getLatestBillByTenantIdService = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { roomId: true },
  });
  if (!tenant) throw new NotFoundError('Tenant not found');

  // Get the latest bill
  const latestBill = await prisma.bill.findFirst({
    where: { roomId: tenant.roomId },
    orderBy: { createdAt: 'desc' },
    include: {
      room: {
        include: {
          tenant: true,
          contract: {
            include: {
              contractType: true,
            },
          },
        },
      },
      totalUnit: true,
      invoice: {
        include: {
          receipt: true,
        },
      },
    },
  });

  if (!latestBill) throw new NotFoundError('No bills found for this tenant');
  return latestBill;
};

export const getBillHistoryByTenantIdService = async (req: Request) => {
  // Calculate pagination
  const { page, limit } = req.validatedQuery as PaginationQueryType;
  const skip = (page - 1) * limit;

  const tenant = await prisma.tenant.findUnique({
    where: { id: req.validatedParams.tenantId as string },
    select: { roomId: true },
  });
  if (!tenant) throw new NotFoundError('Tenant not found');

  const [bills, totalCount] = await prisma.$transaction([
    prisma.bill.findMany({
      where: { roomId: tenant.roomId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        room: {
          include: {
            tenant: true,
            contract: {
              include: {
                contractType: true,
              },
            },
          },
        },
        totalUnit: true,
        invoice: {
          include: {
            receipt: true,
          },
        },
      },
    }),
    prisma.bill.count(),
  ]);

  if (!bills.length) throw new NotFoundError('No bills found for this tenant');

  // Generate pagination data
  const paginationData = generatePaginationData(req, totalCount, page, limit);

  return { data: bills, ...paginationData };
};
