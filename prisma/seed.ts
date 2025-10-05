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
  // Randomize time within the month
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
  // Add random business hours
  newDate.setHours(faker.number.int({ min: 9, max: 17 }));
  newDate.setMinutes(faker.number.int({ min: 0, max: 59 }));
  return newDate;
}

function getSeasonalMultiplier(month: number): number {
  // Higher utility usage in summer (May-August) and winter (Dec-Feb)
  if (month >= 5 && month <= 8) return 1.3; // Summer - more AC usage
  if (month === 12 || month <= 2) return 1.2; // Winter - more heating
  return 1.0; // Normal season
}

function calculateRealisticUtilities(
  roomSize: number,
  seasonMultiplier: number,
  monthOffset: number
) {
  const baseElectricity = roomSize * 15; // Base usage per room size
  const baseWater = roomSize * 8;

  // Add some monthly variation
  const monthlyVariation = 1 + Math.sin(monthOffset * 0.5) * 0.2;

  return {
    electricity:
      Math.round(
        (baseElectricity * seasonMultiplier * monthlyVariation +
          faker.number.int({ min: 20, max: 80 })) *
          10
      ) / 10,
    water:
      Math.round(
        (baseWater * seasonMultiplier * monthlyVariation +
          faker.number.int({ min: 10, max: 40 })) *
          10
      ) / 10,
  };
}

async function main() {
  console.log('🚀 Starting enhanced realistic database seeding...');

  // Clear all tables in proper order to avoid foreign key constraints
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

  // 🏷️ Contract Types (more realistic pricing and facilities)
  await prisma.contractType.createMany({
    data: [
      {
        name: '6 Months',
        duration: 6,
        price: 320000,
        facilities: [
          'WiFi',
          'Water',
          'Electricity',
          'Security',
          'Cleaning Service',
        ],
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
          'Cleaning Service',
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
          'Cleaning Service',
        ],
      },
    ],
  });
  const allContractTypes = await prisma.contractType.findMany();

  // 🏠 Create 100 rooms (20 per floor from 1st to 5th floor)
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
            'Corner room with extra windows',
            'Recently renovated with new appliances',
            'Quiet room facing the garden',
            'City view with balcony',
            'Standard room with essential amenities',
            'Luxury suite with premium finishes',
            'Compact and efficient layout',
            'Family-friendly spacious layout',
          ]),
        },
      });
      rooms.push(room);
    }
  }

  // 👥 Tenants for rented rooms with realistic data
  const rentedRooms = rooms.filter((r) => r.status === 'Rented');
  console.log(`👥 Creating tenants for ${rentedRooms.length} rented rooms...`);

  const tenants = await Promise.all(
    rentedRooms.map((room, index) => {
      const numberOfOccupants = faker.number.int({ min: 1, max: 3 });
      const names = Array.from({ length: numberOfOccupants }, () =>
        faker.person.fullName()
      );
      const emails = names.map(
        (name) =>
          `${name.toLowerCase().replace(/\s+/g, '.')}${faker.number.int({ min: 1, max: 99 })}@gmail.com`
      );

      return prisma.tenant.create({
        data: {
          names: names,
          emails: emails,
          nrcs: Array.from(
            { length: numberOfOccupants },
            () =>
              `${faker.number.int({ min: 1, max: 15 })}/ABCD(N)${faker.number.int({ min: 100000, max: 999999 })}`
          ),
          phone_nos: Array.from(
            { length: numberOfOccupants },
            () => `+959${faker.string.numeric(9)}`
          ),
          emergency_nos: [`+959${faker.string.numeric(9)}`], // Usually just one emergency contact
          room_id: room.id,
        },
      });
    })
  );

  // 👨‍💼 Users with more realistic profiles
  const [adminPassword, staffPassword, tenantPassword] = await Promise.all([
    hashPassword('admin123'),
    hashPassword('staff123'),
    hashPassword('tenant123'),
  ]);

  // Create admin and staff
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

  // Create tenant users
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

  // 📜 Contracts with realistic timelines and relationships
  console.log(`📜 Creating contracts for ${tenants.length} tenants...`);
  for (const tenant of tenants) {
    const room = rentedRooms.find((r) => r.id === tenant.room_id)!;
    const contractType = faker.helpers.arrayElement(allContractTypes);

    // Contract starts 3-18 months ago
    const contractStart = randomPastDate({ monthsAgoMin: 3, monthsAgoMax: 18 });
    const contractExpiry = new Date(contractStart);
    contractExpiry.setMonth(contractExpiry.getMonth() + contractType.duration);

    const contract = await prisma.contract.create({
      data: {
        contract_type_id: contractType.id,
        created_date: contractStart,
        updated_date: randomDaysAfter(contractStart, 1, 7), // Usually updated soon after creation
        expiry_date: contractExpiry,
        room_id: tenant.room_id,
        tenant_id: tenant.id,
      },
    });

    // Generate bills for each month of the contract up to now
    const currentDate = new Date();
    const billDates = [];
    let billDate = new Date(contractStart);
    billDate.setDate(1); // Bills usually generated at start of month

    let monthOffset = 0;
    while (billDate < currentDate) {
      billDates.push({ date: new Date(billDate), monthOffset });
      billDate.setMonth(billDate.getMonth() + 1);
      monthOffset++;
    }

    // Generate bills with realistic progression
    for (const { date: billDate, monthOffset } of billDates) {
      const seasonMultiplier = getSeasonalMultiplier(billDate.getMonth() + 1);
      const roomSize = parseInt(room.dimension.split('x')[0]);
      const utilities = calculateRealisticUtilities(
        roomSize,
        seasonMultiplier,
        monthOffset
      );

      const baseRental = Number(contractType.price);
      const electricityFee = utilities.electricity * 350; // Assume 350 kyats per unit
      const waterFee = utilities.water * 150; // Assume 150 kyats per unit

      // Occasional fees (not every month)
      const hasFine = faker.helpers.weightedArrayElement([
        { weight: 8, value: 0 }, // 80% no fine
        { weight: 2, value: faker.number.int({ min: 5000, max: 20000 }) }, // 20% fine
      ]);

      const hasCarParking = faker.helpers.weightedArrayElement([
        { weight: 6, value: 0 }, // 60% no car
        { weight: 4, value: faker.number.int({ min: 10000, max: 20000 }) }, // 40% with car
      ]);

      const totalAmount =
        baseRental +
        electricityFee +
        waterFee +
        hasFine +
        hasCarParking +
        10000; // service + ground fees

      const bill = await prisma.bill.create({
        data: {
          rental_fee: baseRental,
          electricity_fee: electricityFee,
          water_fee: waterFee,
          fine_fee: hasFine || null,
          service_fee: 5000, // Fixed service fee
          ground_fee: 5000, // Fixed ground fee
          car_parking_fee: hasCarParking || null,
          wifi_fee: 10000, // Fixed WiFi fee
          total_amount: totalAmount,
          due_date: randomDaysAfter(billDate, 7, 14), // Due 1-2 weeks after bill date
          created_at: billDate,
          updated_at: randomDaysAfter(billDate, 0, 2),
          room_id: tenant.room_id,
        },
      });

      // Total units with realistic consumption patterns
      await prisma.totalUnits.create({
        data: {
          electricity_units: utilities.electricity,
          water_units: utilities.water,
          created_at: billDate,
          updated_at: randomDaysAfter(billDate, 0, 2),
          bill_id: bill.id,
        },
      });

      // Invoice with realistic payment patterns
      const invoiceDate = randomDaysAfter(billDate, 0, 3);

      // Determine payment status based on time and probability
      let invoiceStatus: InvoiceStatus = 'Pending';
      const daysSinceInvoice =
        (currentDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceInvoice > 30) {
        // Old invoice - likely paid or overdue
        invoiceStatus = faker.helpers.weightedArrayElement([
          { weight: 7, value: 'Paid' }, // 70% paid
          { weight: 2, value: 'Overdue' }, // 20% overdue
          { weight: 1, value: 'Pending' }, // 10% still pending (problematic tenant)
        ]);
      } else {
        // Recent invoice - more likely pending
        invoiceStatus = faker.helpers.weightedArrayElement([
          { weight: 3, value: 'Paid' }, // 30% paid early
          { weight: 6, value: 'Pending' }, // 60% still pending
          { weight: 1, value: 'Overdue' }, // 10% already overdue
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

      // Create receipt if invoice is paid
      if (invoice.status === 'Paid') {
        const paidDate = randomDaysAfter(invoiceDate, 1, 10); // Paid within 1-10 days
        await prisma.receipt.create({
          data: {
            payment_method: faker.helpers.weightedArrayElement([
              { weight: 6, value: 'Cash' }, // 60% cash
              { weight: 4, value: 'Mobile_Banking' }, // 40% mobile banking
            ]),
            paid_date: paidDate,
            invoice_id: invoice.id,
            created_at: paidDate,
            updated_at: randomDaysAfter(paidDate, 0, 1),
          },
        });
      }
    }

    // 🛠️ Customer service requests with realistic timing and patterns
    const serviceCount = faker.number.int({ min: 0, max: 5 }); // Some tenants might have no requests

    // Different types of service requests with different probabilities
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

      const descriptions = {
        Maintenance: [
          'AC not cooling properly',
          'Leaking faucet in bathroom',
          'Light fixture not working',
          'Door lock needs adjustment',
          'Kitchen cabinet hinge broken',
        ],
        Complain: [
          'Noise from neighboring room',
          'Parking space being occupied by others',
          'Common area cleanliness issue',
          'WiFi connectivity problems',
          'Security concern about main gate',
        ],
        Other: [
          'Request for additional furniture',
          'Guest registration inquiry',
          'Contract extension discussion',
          'Package delivery notification',
        ],
      };

      // Find the full service config including priorities
      const serviceConfig = serviceTypes.find(
        (s) => s.value === selectedService
      )!;

      await prisma.customerService.create({
        data: {
          description: faker.helpers.arrayElement(
            descriptions[selectedService as keyof typeof descriptions]
          ),
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

  console.log('✅ Enhanced database seeding completed!');
  console.log(`🏠 Created: ${rooms.length} rooms across 5 floors`);
  console.log('📊 Room Status Distribution:');
  roomStatusCount.forEach((status) => {
    console.log(`   ${status.status}: ${status._count} rooms`);
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
