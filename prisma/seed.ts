import { faker } from '@faker-js/faker';
import { hashPassword } from '../src/common/auth/password';
import prisma from '../src/lib/prismaClient';
import {
  Category,
  InvoiceStatus,
  PriorityLevel,
  RoomStatus,
  ServiceStatus,
  RelationshipToTenant,
  UserRole,
  PaymentMethod,
  Prisma,
} from '../generated/prisma';

// === Type Definitions ===
interface RandomDateOptions {
  monthsAgoMin?: number;
  monthsAgoMax?: number;
}

interface Utilities {
  electricity: number;
  water: number;
}

interface ServiceTypeConfig {
  category: Category;
  weight: number;
  priorities: PriorityLevel[];
}

// === Utility functions ===
function randomPastDate({
  monthsAgoMin = 1,
  monthsAgoMax = 12,
}: RandomDateOptions = {}): Date {
  const monthsAgo = faker.number.int({ min: monthsAgoMin, max: monthsAgoMax });
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(faker.number.int({ min: 1, max: 28 }));
  date.setHours(faker.number.int({ min: 9, max: 17 }));
  date.setMinutes(faker.number.int({ min: 0, max: 59 }));
  return date;
}

function randomDaysAfter(date: Date, minDays = 1, maxDays = 30): Date {
  const newDate = new Date(date);
  newDate.setDate(
    newDate.getDate() + faker.number.int({ min: minDays, max: maxDays })
  );
  newDate.setHours(faker.number.int({ min: 9, max: 17 }));
  newDate.setMinutes(faker.number.int({ min: 0, max: 59 }));
  return newDate;
}

function calculateUtilities(): Utilities {
  return {
    electricity: faker.number.float({ min: 50, max: 200, fractionDigits: 1 }),
    water: faker.number.float({ min: 20, max: 100, fractionDigits: 1 }),
  };
}

const tables = [
  'receipt',
  'invoice',
  'totalUnits',
  'bill',
  'customerService',
  'contract',
  'contractType',
  'occupant',
  'user',
  'tenant',
  'room',
] as const;

async function cleanUpDatabase() {
  // Use transaction for faster cleanup
  await prisma.$transaction([
    ...tables.map((table) => (prisma as any)[table].deleteMany()),
  ]);
  console.log('🧹 Database cleaned up successfully.');
}

// Batch creation functions
async function createRoomsBatch(totalFloors: number, roomsPerFloor: number) {
  console.log('🏗️ Creating rooms in batch...');
  const roomData: Prisma.RoomCreateManyInput[] = [];

  for (let floor = 1; floor <= totalFloors; floor++) {
    for (let roomIndex = 1; roomIndex <= roomsPerFloor; roomIndex++) {
      const roomNo = floor * 100 + roomIndex;
      const dimension = `${faker.number.int({ min: 12, max: 25 })}x${faker.number.int({ min: 12, max: 25 })}`;

      let status: RoomStatus;
      const random = Math.random();
      if (random < 0.7) status = 'Rented';
      else if (random < 0.8) status = 'Purchased';
      else if (random < 0.9) status = 'InMaintenance';
      else status = 'Available';

      roomData.push({
        roomNo: roomNo,
        floor: floor,
        dimension: `${dimension} ft`,
        noOfBedRoom: faker.number.int({ min: 1, max: 3 }),
        status: status,
        sellingPrice:
          status === 'Purchased'
            ? new Prisma.Decimal(
                faker.number.int({ min: 250000, max: 1500000 })
              )
            : null,
        maxNoOfPeople: faker.number.int({ min: 2, max: 6 }),
        description: faker.helpers.arrayElement([
          'Spacious room with natural lighting',
          'Modern design with built-in furniture',
          'City view with balcony',
          'Standard room with essential amenities',
        ]),
      });
    }
  }

  // Batch create all rooms
  await prisma.room.createMany({ data: roomData });
  return await prisma.room.findMany();
}

async function createTenantsAndUsersBatch(
  occupiedRooms: Prisma.RoomGetPayload<object>[]
) {
  console.log(
    `👥 Creating ${occupiedRooms.length} tenants and users in batch...`
  );

  const tenantData: Prisma.TenantCreateManyInput[] = [];
  const userData: Prisma.UserCreateManyInput[] = [];
  const tenantPassword = await hashPassword('tenant123');

  for (const room of occupiedRooms) {
    const name = faker.person.fullName();
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}${faker.number.int({ min: 1, max: 99 })}@gmail.com`;
    const nrc = `${faker.number.int({ min: 1, max: 15 })}/ABCD(N)${faker.number.int({ min: 100000, max: 999999 })}`;
    const phoneNo = `+959${faker.string.numeric(9)}`;
    const emergencyNo = `+959${faker.string.numeric(9)}`;

    tenantData.push({
      name,
      email,
      nrc,
      phoneNo,
      emergencyNo,
      roomId: room.id,
    });
  }

  // Batch create tenants
  await prisma.tenant.createMany({ data: tenantData });
  const tenants = await prisma.tenant.findMany({
    where: { roomId: { in: occupiedRooms.map((r) => r.id) } },
  });

  // Prepare user data
  for (const tenant of tenants) {
    userData.push({
      userName:
        tenant.name.split(' ')[0].toLowerCase() +
        faker.number.int({ min: 1, max: 99 }),
      email: tenant.email,
      password: tenantPassword,
      role: 'Tenant' as UserRole,
      tenantId: tenant.id,
    });
  }

  // Add admin/staff users
  const [adminPassword, staffPassword] = await Promise.all([
    hashPassword('admin123'),
    hashPassword('staff123'),
  ]);

  userData.push(
    {
      userName: 'admin',
      email: 'admin@gmail.com',
      password: adminPassword,
      role: 'Admin' as UserRole,
    },
    {
      userName: 'staff.john',
      email: 'john.staff@gmail.com',
      password: staffPassword,
      role: 'Staff' as UserRole,
    },
    {
      userName: 'staff.sarah',
      email: 'sarah.staff@gmail.com',
      password: staffPassword,
      role: 'Staff' as UserRole,
    }
  );

  // Batch create all users
  await prisma.user.createMany({ data: userData });
  return tenants;
}

async function createOccupantsBatch(
  tenants: Prisma.TenantGetPayload<object>[]
) {
  console.log(`👪 Creating occupants in batch...`);

  const occupantData: Prisma.OccupantCreateManyInput[] = [];

  for (const tenant of tenants) {
    const numberOfOccupants = faker.number.int({ min: 0, max: 3 });
    const relationships: RelationshipToTenant[] = faker.helpers.arrayElements(
      ['SPOUSE', 'PARENT', 'CHILD', 'SIBLING', 'RELATIVE', 'FRIEND', 'OTHER'],
      numberOfOccupants
    );

    relationships.forEach((relationship) => {
      occupantData.push({
        name: faker.person.fullName(),
        nrc:
          Math.random() < 0.8
            ? `${faker.number.int({ min: 1, max: 15 })}/ABCD(N)${faker.number.int({ min: 100000, max: 999999 })}`
            : null,
        relationshipToTenant: relationship,
        tenantId: tenant.id,
      });
    });
  }

  // Batch create all occupants
  if (occupantData.length > 0) {
    await prisma.occupant.createMany({ data: occupantData });
  }
}

async function createContractsBatch(
  tenants: Prisma.TenantGetPayload<object>[],
  allContractTypes: Prisma.ContractTypeGetPayload<object>[],
  occupiedRooms: Prisma.RoomGetPayload<object>[]
) {
  console.log(`📜 Creating contracts in batch...`);

  const contractData: Prisma.ContractCreateManyInput[] = [];
  const rentedRooms = occupiedRooms.filter((r) => r.status === 'Rented');
  const rentedTenants = tenants.filter((t) =>
    rentedRooms.some((r) => r.id === t.roomId)
  );

  for (const tenant of rentedTenants) {
    const contractType = faker.helpers.arrayElement(allContractTypes);
    const contractStart = randomPastDate({ monthsAgoMin: 3, monthsAgoMax: 18 });
    const contractExpiry = new Date(contractStart);
    contractExpiry.setMonth(contractExpiry.getMonth() + contractType.duration);

    contractData.push({
      contractTypeId: contractType.id,
      createdDate: contractStart,
      updatedDate: randomDaysAfter(contractStart, 1, 7),
      expiryDate: contractExpiry,
      roomId: tenant.roomId,
      tenantId: tenant.id,
    });
  }

  if (contractData.length > 0) {
    await prisma.contract.createMany({ data: contractData });
  }
}

async function createBillsAndInvoicesBatch(
  tenants: Prisma.TenantGetPayload<object>[],
  allContractTypes: Prisma.ContractTypeGetPayload<object>[],
  occupiedRooms: Prisma.RoomGetPayload<object>[]
) {
  console.log(`💰 Creating bills and invoices in batch...`);

  const billData: Prisma.BillCreateManyInput[] = [];
  const totalUnitsData: Prisma.TotalUnitsCreateManyInput[] = [];
  const invoiceData: Prisma.InvoiceCreateManyInput[] = [];
  const receiptData: Prisma.ReceiptCreateManyInput[] = [];
  const currentDate = new Date();

  for (const tenant of tenants) {
    const room = occupiedRooms.find((r) => r.id === tenant.roomId)!;
    const contractType = faker.helpers.arrayElement(allContractTypes);
    const contractStart = randomPastDate({ monthsAgoMin: 3, monthsAgoMax: 18 });

    // Generate bill dates
    const billDates: Date[] = [];
    let billDate = new Date(contractStart);
    billDate.setDate(1);

    while (billDate < currentDate) {
      billDates.push(new Date(billDate));
      billDate.setMonth(billDate.getMonth() + 1);
    }

    for (const billDate of billDates) {
      const utilities = calculateUtilities();
      const baseRental =
        room.status === 'Rented' ? Number(contractType.price) : 0;
      const electricityFee = utilities.electricity * 350;
      const waterFee = utilities.water * 150;
      const hasFine =
        Math.random() < 0.2 ? faker.number.int({ min: 5000, max: 20000 }) : 0;
      const hasCarParking =
        Math.random() < 0.4 ? faker.number.int({ min: 10000, max: 20000 }) : 0;
      const totalAmount =
        baseRental +
        electricityFee +
        waterFee +
        hasFine +
        hasCarParking +
        10000;

      const billId = faker.string.uuid();
      const dueDate = randomDaysAfter(billDate, 7, 14);

      billData.push({
        id: billId,
        rentalFee: new Prisma.Decimal(baseRental),
        electricityFee: new Prisma.Decimal(electricityFee),
        waterFee: new Prisma.Decimal(waterFee),
        fineFee: hasFine ? new Prisma.Decimal(hasFine) : null,
        serviceFee: new Prisma.Decimal(5000),
        groundFee: new Prisma.Decimal(5000),
        carParkingFee: hasCarParking ? new Prisma.Decimal(hasCarParking) : null,
        wifiFee: new Prisma.Decimal(10000),
        totalAmount: new Prisma.Decimal(totalAmount),
        dueDate: dueDate,
        createdAt: billDate,
        updatedAt: randomDaysAfter(billDate, 0, 2),
        roomId: tenant.roomId,
      });

     
      totalUnitsData.push({
        electricityUnits: new Prisma.Decimal(utilities.electricity),
        waterUnits: new Prisma.Decimal(utilities.water),
        createdAt: billDate,
        updatedAt: randomDaysAfter(billDate, 0, 2),
        billId: billId,
      });

      const invoiceDate = randomDaysAfter(billDate, 0, 3);
      let invoiceStatus: InvoiceStatus;
      const daysSinceInvoice =
        (currentDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceInvoice > 30) {
        invoiceStatus = faker.helpers.weightedArrayElement([
          { weight: 7, value: 'Paid' as InvoiceStatus },
          { weight: 2, value: 'Overdue' as InvoiceStatus },
          { weight: 1, value: 'Pending' as InvoiceStatus },
        ]);
      } else {
        invoiceStatus = faker.helpers.weightedArrayElement([
          { weight: 3, value: 'Paid' as InvoiceStatus },
          { weight: 6, value: 'Pending' as InvoiceStatus },
          { weight: 1, value: 'Overdue' as InvoiceStatus },
        ]);
      }

      const invoiceId = faker.string.uuid();
      invoiceData.push({
        id: invoiceId,
        status: invoiceStatus,
        billId: billId,
        invoiceNo: `INV-${faker.string.alphanumeric(8).toUpperCase()}`,
        createdAt: invoiceDate,
        updatedAt: randomDaysAfter(invoiceDate, 0, 5),
      });

      if (invoiceStatus === 'Paid') {
        const paidDate = randomDaysAfter(invoiceDate, 1, 10);
        receiptData.push({
          paymentMethod: faker.helpers.weightedArrayElement([
            { weight: 6, value: 'Cash' as PaymentMethod },
            { weight: 4, value: 'Mobile_Banking' as PaymentMethod },
          ]),
          paidDate: paidDate,
          invoiceId: invoiceId,
          createdAt: paidDate,
          updatedAt: randomDaysAfter(paidDate, 0, 1),
        });
      }
    }
  }

  // Batch create all bills and related data in transaction
  console.log('💾 Saving bills and related data...');
  const chunkSize = 1000;
  // Bills
  for (let i = 0; i < billData.length; i += chunkSize) {
    const chunk = billData.slice(i, i + chunkSize);
    await prisma.bill.createMany({ data: chunk });
  }

  // Total units
  for (let i = 0; i < totalUnitsData.length; i += chunkSize) {
    const chunk = totalUnitsData.slice(i, i + chunkSize);
    await prisma.totalUnits.createMany({ data: chunk });
  }

  // Invoices
  for (let i = 0; i < invoiceData.length; i += chunkSize) {
    const chunk = invoiceData.slice(i, i + chunkSize);
    await prisma.invoice.createMany({ data: chunk });
  }

  // Receipts
  if (receiptData.length > 0) {
    for (let i = 0; i < receiptData.length; i += chunkSize) {
      const chunk = receiptData.slice(i, i + chunkSize);
      await prisma.receipt.createMany({ data: chunk });
    }
  }
}

async function createCustomerServicesBatch(
  tenants: Prisma.TenantGetPayload<object>[],
  occupiedRooms: Prisma.RoomGetPayload<object>[]
) {
  console.log(`🛠️ Creating customer services in batch...`);

  const serviceData: Prisma.CustomerServiceCreateManyInput[] = [];
  const serviceTypes: ServiceTypeConfig[] = [
    {
      category: Category.Maintenance,
      weight: 6,
      priorities: [PriorityLevel.Low, PriorityLevel.Medium],
    },
    {
      category: Category.Complain,
      weight: 3,
      priorities: [PriorityLevel.Medium, PriorityLevel.High],
    },
    { category: Category.Other, weight: 1, priorities: [PriorityLevel.Low] },
  ];

  for (const tenant of tenants) {
    const room = occupiedRooms.find((r) => r.id === tenant.roomId)!;
    const contractStart = randomPastDate({ monthsAgoMin: 3, monthsAgoMax: 18 });
    const serviceCount = faker.number.int({ min: 0, max: 5 });

    for (let i = 0; i < serviceCount; i++) {
      const selectedService = faker.helpers.weightedArrayElement(
        serviceTypes.map((s) => ({ weight: s.weight, value: s }))
      ) as ServiceTypeConfig;
      const issuedDate = randomDaysAfter(contractStart, 10, 180);

      let status: ServiceStatus;
      const daysSinceRequest =
        (new Date().getTime() - issuedDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceRequest > 14) {
        status = faker.helpers.weightedArrayElement([
          { value: 'Resolved' as ServiceStatus, weight: 7 },
          { value: 'Ongoing' as ServiceStatus, weight: 2 },
          { value: 'Pending' as ServiceStatus, weight: 1 },
        ]);
      } else if (daysSinceRequest > 3) {
        status = faker.helpers.weightedArrayElement([
          { value: 'Resolved' as ServiceStatus, weight: 4 },
          { value: 'Ongoing' as ServiceStatus, weight: 4 },
          { value: 'Pending' as ServiceStatus, weight: 2 },
        ]);
      } else {
        status = 'Pending';
      }

      const serviceConfig = serviceTypes.find(
        (s) => s.category === selectedService.category
      )!;

      const priority = faker.helpers.arrayElement(
        serviceConfig.priorities
      ) as PriorityLevel;

      serviceData.push({
        description: faker.lorem.sentence(),
        category: selectedService.category,
        status: status,
        priorityLevel: priority,
        issuedDate: issuedDate,
        createdAt: issuedDate,
        updatedAt: randomDaysAfter(issuedDate, 1, 7),
        roomId: room.id,
      });
    }
  }

  // Batch create services
  if (serviceData.length > 0) {
    const chunkSize = 1000;
    for (let i = 0; i < serviceData.length; i += chunkSize) {
      const chunk = serviceData.slice(i, i + chunkSize);
      await prisma.customerService.createMany({ data: chunk });
    }
  }
}

// === Main Seeding Function ===
async function main() {
  console.log('🧹 Cleaning up existing data...');
  await cleanUpDatabase();

  console.log('🚀 Starting database seeding...');
  const startTime = Date.now();

  // Contract Types
  await prisma.contractType.createMany({
    data: [
      {
        name: '6 Months',
        duration: 6,
        price: new Prisma.Decimal(320000),
        facilities: ['WiFi', 'Water', 'Electricity', 'Security', 'Cleaning'],
      },
      {
        name: '12 Months',
        duration: 12,
        price: new Prisma.Decimal(300000),
        facilities: [
          'WiFi',
          'Water',
          'Electricity',
          'Security',
          'Parking',
          'Cleaning',
        ],
      },
      {
        name: '24 Months',
        duration: 24,
        price: new Prisma.Decimal(280000),
        facilities: [
          'WiFi',
          'Water',
          'Electricity',
          'Security',
          'Gym',
          'Parking',
          'Cleaning',
        ],
      },
    ],
  });
  const allContractTypes = await prisma.contractType.findMany();

  // Create rooms
  const totalFloors = 5;
  const roomsPerFloor = 20;
  const rooms = await createRoomsBatch(totalFloors, roomsPerFloor);

  // Filter occupied rooms
  const occupiedRooms = rooms.filter(
    (r) => r.status === 'Rented' || r.status === 'Purchased'
  );

  // Create tenants and users
  const tenants = await createTenantsAndUsersBatch(occupiedRooms);

  // Create occupants
  await createOccupantsBatch(tenants);

  // Create contracts
  await createContractsBatch(tenants, allContractTypes, occupiedRooms);

  // Create bills and invoices (this is the most time-consuming part)
  await createBillsAndInvoicesBatch(tenants, allContractTypes, occupiedRooms);

  // Create customer services
  await createCustomerServicesBatch(tenants, occupiedRooms);

  // Print statistics
  const roomStatusCount = await prisma.room.groupBy({
    by: ['status'],
    _count: true,
  });

  const endTime = Date.now();
  console.log('✅ Database seeding completed!');
  console.log(
    `⏱️ Total time: ${((endTime - startTime) / 1000).toFixed(2)} seconds`
  );
  console.log(`🏠 Created: ${rooms.length} rooms across ${totalFloors} floors`);
  console.log('📊 Room Status Distribution:');
  roomStatusCount.forEach((status) => {
    console.log(` - ${status.status}: ${status._count} rooms`);
  });
  console.log(`👥 Created: ${tenants.length} tenants`);
  console.log(`👪 Created: ${await prisma.occupant.count()} occupants`);
  console.log(`👤 Created: ${await prisma.user.count()} users`);
  console.log(`📊 Created: ${await prisma.contract.count()} contracts`);
  console.log(`💰 Created: ${await prisma.bill.count()} bills`);
  console.log(`🧾 Created: ${await prisma.invoice.count()} invoices`);
  console.log(`📄 Created: ${await prisma.receipt.count()} receipts`);
  console.log(
    `🛠️ Created: ${await prisma.customerService.count()} service requests`
  );
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
