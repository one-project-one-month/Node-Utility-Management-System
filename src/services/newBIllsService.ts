import { Request } from 'express';
import { BadRequestError, NotFoundError } from '../common/errors';
import { generatePaginationData } from '../common/utils/paginationHelper';
import prisma from '../lib/prismaClient';
import {
  CreateBillSchemaType,
  UpdateBillSchemaType,
} from '../validations/newBillsSchema';
import { PaginationQueryType } from '../validations/paginationSchema';
import { mailOptionConfig, mailTransporter } from '../common/utils/mail-service/mailTransporter';
import { Bill, Invoice, Room, TotalUnits } from '../../generated/prisma';

// define rate constants (cost per unit)
const ELECTRICITY_RATE = 500;
const WATER_RATE = 300;

// Utility: generate random number within range
const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Utility: generate random date within ±15 days
const randomDate = () => {
  const now = new Date();
  const futureDate = new Date(now.getTime()); 

  const randomDays = Math.floor(Math.random() * 30) - 15; 
  futureDate.setDate(futureDate.getDate() + randomDays);
  
  return futureDate;
};

const mailBodyGenerator = (name:string, room:Room, bill:Bill, invoice:Invoice, totalUnits:TotalUnits) => {
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
      <p>Best regards,<br/>Utility Management Team</p>
    `;
  return htmlContent;
}

export const autoGenerateBillsService = async () => {
  // Fetch all rooms with status 'Rented'
  const rooms = await prisma.room.findMany({
      where: {
          status: 'Rented',
        },
      include:{
        tenant: true
      }
    },
  );

  // Create Mail Transporter
  const transporter = await mailTransporter();

  // Generate bills for each room
  for (const room of rooms) {
    // Reuse createBillService with minimal data
    const {bill, invoice, totalUnits} = await createBillService({
      roomId: room.id,
    });

    // Email sending logic to notify tenants about their new bills
    // Prepare mail body
    const tenantName = room.tenant!.name;
    const tenantEmail = room.tenant!.email;
    const htmlContent = mailBodyGenerator(tenantName,room, bill, invoice, totalUnits);
  
    // prepare mail data
    const mailOptions = await mailOptionConfig({
      name: tenantName,
      to: tenantEmail,
      subject: 'Your Bill for this month',
      htmlContent: htmlContent,
    })
  
    // Send email
    await transporter.sendMail(mailOptions);
  }
  return rooms.length;
}

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
      contract : {
        include: {
          contractType: true,
        },
      }
    }
  });

  if (!room) throw new NotFoundError('Room not found');

  // Generate random data if missing
  const rent = rentalFee ?? Number(room.contract[0].contractType.price);
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
      dueDate: new Date(dueDate ?? randomDate()),
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

  return {bill, invoice, totalUnits};
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
      room: true,
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

export const getAllBillsService = async (
  query: PaginationQueryType,
  req: Request
) => {
  // Calculate pagination
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  // get all bills and total count
  const [bills, totalCount] = await prisma.$transaction([
    prisma.bill.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        room: {
          include: {
            tenant: true,
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

export const getBillHistoryByTenantIdService = async (
  tenantId: string,
  query: PaginationQueryType,
  req: Request
) => {
  // Calculate pagination
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
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
