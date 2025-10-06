import { faker } from '@faker-js/faker';
import { hashPassword } from '../src/common/auth/password';
import prisma from '../src/lib/prismaClient';
import {
  Category,
  InvoiceStatus,
  PriorityLevel,
  Room,
  RoomStatus,
  ServiceStatus,
} from '../generated/prisma';

// === Utility functions ===
function randomPastDate({ monthsAgoMin = 1, monthsAgoMax = 12 } = {}) {
  const monthsAgo = faker.number.int({ min: monthsAgoMin, max: monthsAgoMax });
  const date = new Date();
  date.setMonth(date.getMonth() - monthsAgo);
  date.setDate(faker.number.int({ min: 1, max: 28 }));
  date.setHours(faker.number.int({ min: 9, max: 17 }));
  date.setMinutes(faker.number.int({ min: 0, max: 59 }));
  return date;
}

function randomDaysAfter(date: Date, minDays = 1, maxDays = 30) {
  const newDate = new Date(date);
  newDate.setDate(
    newDate.getDate() + faker.number.int({ min: minDays, max: maxDays })
  );
  newDate.setHours(faker.number.int({ min: 9, max: 17 }));
  newDate.setMinutes(faker.number.int({ min: 0, max: 59 }));
  return newDate;
}

function calculateUtilities() {
  return {
    electricity: faker.number.float({ min: 50, max: 200, fractionDigits: 1 }),
    water: faker.number.float({ min: 20, max: 100, fractionDigits: 1 }),
  };
}

async function main() {
  console.log('🚀 Starting database seeding...');

  // Clear all tables in proper order
  const tables = [
    'receipt',
    'invoice',
    'totalUnits',
    'bill',
    'customerService',
    'contract',
    'contractType',
    'user',
    'tenant',
    'room',
  ];

  for (const table of tables) {
    await (prisma as any)[table].deleteMany();
  }

  // Contract Types
  await prisma.contractType.createMany({
    data: [
      {
        name: '6 Months',
        duration: 6,
        price: 320000,
        facilities: ['WiFi', 'Water', 'Electricity', 'Security', 'Cleaning'],
      },
      {
        name: '12 Months',
        duration: 12,
        price: 300000,
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
        price: 280000,
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

  // Create 100 rooms
  console.log('🏗️ Creating 100 rooms across 5 floors...');
  const rooms: Room[] = [];
  const totalFloors = 5;
  const roomsPerFloor = 20;

  for (let floor = 1; floor <= totalFloors; floor++) {
    for (let roomIndex = 1; roomIndex <= roomsPerFloor; roomIndex++) {
      const roomNo = floor * 100 + roomIndex;
      const dimension = `${faker.number.int({ min: 12, max: 25 })}x${faker.number.int({ min: 12, max: 25 })}`;

      // Determine room status with realistic distribution
      let status: RoomStatus;
      const random = Math.random();

      if (random < 0.7) {
        // 70% rented
        status = 'Rented';
      } else if (random < 0.85) {
        // 15% available
        status = 'Available';
      } else if (random < 0.95) {
        // 10% in maintenance
        status = 'InMaintenance';
      } else {
        // 5% purchased
        status = 'Purchased';
      }

      const room = await prisma.room.create({
        data: {
          room_no: roomNo,
          floor: floor,
          dimension: `${dimension} ft`,
          no_of_bed_room: faker.number.int({ min: 1, max: 3 }),
          status: status,
          selling_price: faker.number.int({ min: 250000, max: 1500000 }),
          max_no_of_people: faker.number.int({ min: 2, max: 6 }),
          description: faker.helpers.arrayElement([
            'Spacious room with natural lighting',
            'Modern design with built-in furniture',
            'City view with balcony',
            'Standard room with essential amenities',
          ]),
        },
      });
      rooms.push(room);
    }
  }

  // Tenants for rented rooms
  const rentedRooms = rooms.filter((r) => r.status === 'Rented');
  console.log(`👥 Creating tenants for ${rentedRooms.length} rented rooms...`);

  const tenants = await Promise.all(
    rentedRooms.map((room) => {
      const numberOfOccupants = faker.number.int({ min: 1, max: 3 });
      const names = Array.from({ length: numberOfOccupants }, () =>
        faker.person.fullName()
      );
      const emails = names.map(
        (name) =>
          `${name.toLowerCase().replace(/\s+/g, '.')}${faker.number.int({ min: 1, max: 99 })}@gmail.com`
      );
      const nrcs = Array.from(
        { length: numberOfOccupants },
        () =>
          `${faker.number.int({ min: 1, max: 15 })}/ABCD(N)${faker.number.int({ min: 100000, max: 999999 })}`
      );
      const phone_nos = Array.from(
        { length: numberOfOccupants },
        () => `+959${faker.string.numeric(9)}`
      );

      return prisma.tenant.create({
        data: {
          names: names,
          emails: emails,
          nrcs: nrcs,
          phone_nos: phone_nos,
          emergency_nos: [`+959${faker.string.numeric(9)}`],
          room_id: room.id,
        },
      });
    })
  );

  // Users
  const [adminPassword, staffPassword, tenantPassword] = await Promise.all([
    hashPassword('admin123'),
    hashPassword('staff123'),
    hashPassword('tenant123'),
  ]);

  await prisma.user.createMany({
    data: [
      {
        user_name: 'admin',
        email: 'admin@gmail.com',
        password: adminPassword,
        role: 'Admin',
      },
      {
        user_name: 'staff.john',
        email: 'john.staff@gmail.com',
        password: staffPassword,
        role: 'Staff',
      },
      {
        user_name: 'staff.sarah',
        email: 'sarah.staff@gmail.com',
        password: staffPassword,
        role: 'Staff',
      },
    ],
  });

  console.log(`👤 Creating user accounts for ${tenants.length} tenants...`);
  await Promise.all(
    tenants.map((tenant) =>
      prisma.user.create({
        data: {
          user_name:
            tenant.names[0].split(' ')[0].toLowerCase() +
            faker.number.int({ min: 1, max: 99 }),
          email: tenant.emails[0],
          password: tenantPassword,
          role: 'Tenant',
          tenant_id: tenant.id,
        },
      })
    )
  );

  // Contracts and bills
  console.log(`📜 Creating contracts for ${tenants.length} tenants...`);
  for (const tenant of tenants) {
    const room = rentedRooms.find((r) => r.id === tenant.room_id)!;
    const contractType = faker.helpers.arrayElement(allContractTypes);

    const contractStart = randomPastDate({ monthsAgoMin: 3, monthsAgoMax: 18 });
    const contractExpiry = new Date(contractStart);
    contractExpiry.setMonth(contractExpiry.getMonth() + contractType.duration);

    await prisma.contract.create({
      data: {
        contract_type_id: contractType.id,
        created_date: contractStart,
        updated_date: randomDaysAfter(contractStart, 1, 7),
        expiry_date: contractExpiry,
        room_id: tenant.room_id,
        tenant_id: tenant.id,
      },
    });

    // Generate bills for each month
    const currentDate = new Date();
    const billDates = [];
    let billDate = new Date(contractStart);
    billDate.setDate(1);

    while (billDate < currentDate) {
      billDates.push(new Date(billDate));
      billDate.setMonth(billDate.getMonth() + 1);
    }

    for (const billDate of billDates) {
      const utilities = calculateUtilities();
      const baseRental = Number(contractType.price);
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

      const bill = await prisma.bill.create({
        data: {
          rental_fee: baseRental,
          electricity_fee: electricityFee,
          water_fee: waterFee,
          fine_fee: hasFine || null,
          service_fee: 5000,
          ground_fee: 5000,
          car_parking_fee: hasCarParking || null,
          wifi_fee: 10000,
          total_amount: totalAmount,
          due_date: randomDaysAfter(billDate, 7, 14),
          created_at: billDate,
          updated_at: randomDaysAfter(billDate, 0, 2),
          room_id: tenant.room_id,
        },
      });

      await prisma.totalUnits.create({
        data: {
          electricity_units: utilities.electricity,
          water_units: utilities.water,
          created_at: billDate,
          updated_at: randomDaysAfter(billDate, 0, 2),
          bill_id: bill.id,
        },
      });

      const invoiceDate = randomDaysAfter(billDate, 0, 3);

      let invoiceStatus: InvoiceStatus = 'Pending';
      const daysSinceInvoice =
        (currentDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceInvoice > 30) {
        invoiceStatus = faker.helpers.weightedArrayElement([
          { weight: 7, value: 'Paid' },
          { weight: 2, value: 'Overdue' },
          { weight: 1, value: 'Pending' },
        ]);
      } else {
        invoiceStatus = faker.helpers.weightedArrayElement([
          { weight: 3, value: 'Paid' },
          { weight: 6, value: 'Pending' },
          { weight: 1, value: 'Overdue' },
        ]);
      }

      const invoice = await prisma.invoice.create({
        data: {
          status: invoiceStatus,
          bill_id: bill.id,
          created_at: invoiceDate,
          updated_at: randomDaysAfter(invoiceDate, 0, 5),
        },
      });

      if (invoice.status === 'Paid') {
        const paidDate = randomDaysAfter(invoiceDate, 1, 10);
        await prisma.receipt.create({
          data: {
            payment_method: faker.helpers.weightedArrayElement([
              { weight: 6, value: 'Cash' },
              { weight: 4, value: 'Mobile_Banking' },
            ]),
            paid_date: paidDate,
            invoice_id: invoice.id,
            created_at: paidDate,
            updated_at: randomDaysAfter(paidDate, 0, 1),
          },
        });
      }
    }

    // Customer service requests
    const serviceCount = faker.number.int({ min: 0, max: 5 });
    const serviceTypes: {
      value: Category;
      weight: number;
      priorities: PriorityLevel[];
    }[] = [
      { value: 'Maintenance', weight: 6, priorities: ['Low', 'Medium'] },
      { value: 'Complain', weight: 3, priorities: ['Medium', 'High'] },
      { value: 'Other', weight: 1, priorities: ['Low'] },
    ];

    for (let i = 0; i < serviceCount; i++) {
      const selectedService = faker.helpers.weightedArrayElement(serviceTypes);
      const issuedDate = randomDaysAfter(
        contractStart,
        10,
        contractType.duration * 30 - 30
      );

      // Status depends on how old the request is
      let status: ServiceStatus = 'Pending';
      const daysSinceRequest =
        (currentDate.getTime() - issuedDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceRequest > 14) {
        status = faker.helpers.weightedArrayElement([
          { value: 'Resolved', weight: 7 },
          { value: 'Ongoing', weight: 2 },
          { value: 'Pending', weight: 1 },
        ]);
      } else if (daysSinceRequest > 3) {
        status = faker.helpers.weightedArrayElement([
          { value: 'Resolved', weight: 4 },
          { value: 'Ongoing', weight: 4 },
          { value: 'Pending', weight: 2 },
        ]);
      }

      const serviceConfig = serviceTypes.find(
        (s) => s.value === selectedService
      )!;

      await prisma.customerService.create({
        data: {
          description: faker.lorem.sentence(),
          category: selectedService,
          status: status,
          priority_level: faker.helpers.arrayElement(serviceConfig.priorities),
          issued_date: issuedDate,
          created_at: issuedDate,
          updated_at: randomDaysAfter(issuedDate, 1, 7),
          room_id: tenant.room_id,
        },
      });
    }
  }

  // Print final statistics
  const roomStatusCount = await prisma.room.groupBy({
    by: ['status'],
    _count: true,
  });

  console.log('✅ Database seeding completed!');
  console.log(`🏠 Created: ${rooms.length} rooms across 5 floors`);
  console.log('📊 Room Status Distribution:');
  roomStatusCount.forEach((status) => {
    console.log(` -  ${status.status}: ${status._count} rooms`);
  });
  console.log(`👥 Created: ${tenants.length} tenants`);
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

// ###High Volume (500-1000):###
// Bills: 790-810
// Invoices: 790-810
// Receipts: 520-540

// #####################################
// ###Medium Volume (100-500):###
// Rooms: 100 (fixed)
// Tenants: 70-75
// Contracts: 70-75
// Customer Services: 160-200

// #####################################
// ###Low Volume (<100):###
// Users: ~73-76
// Contract Types: 3 (fixed)
// Total Units: 790-810
