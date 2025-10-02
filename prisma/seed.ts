import { hashPassword } from '../src/common/auth/password';
import prisma from '../src/lib/prismaClient';

async function main() {
<<<<<<< HEAD
  console.log('Starting database seeding...');

  // Clear existing data (in reverse order of dependencies)
  console.log('Clearing existing data...');
  await prisma.receipt.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.totalUnits.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.customerService.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.contractType.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.room.deleteMany();

  // 1. Seed Contract Types
  const contractTypes = await Promise.all([
    prisma.contractType.create({
      data: {
        name: '6 Months',
        duration: 6,
        price: 300000,
        facilities: ['WiFi', 'Water', 'Electricity', 'Security'],
      },
    }),
    prisma.contractType.create({
      data: {
        name: '12 Months',
        duration: 12,
        price: 280000,
        facilities: ['WiFi', 'Water', 'Electricity', 'Security', 'Parking'],
      },
    }),
    prisma.contractType.create({
      data: {
        name: '24 Months',
        duration: 24,
        price: 250000,
        facilities: [
          'WiFi',
          'Water',
          'Electricity',
          'Security',
          'Parking',
          'Gym',
        ],
      },
    }),
  ]);

  // 2. Seed Rooms
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        room_no: 101,
        floor: 1,
        dimension: '12x10 ft',
        no_of_bed_room: 1,
        status: 'Rented',
        selling_price: 500000,
        max_no_of_people: 2,
        description: 'Cozy single bedroom with attached bathroom',
      },
    }),
    prisma.room.create({
      data: {
        room_no: 102,
        floor: 1,
        dimension: '15x12 ft',
        no_of_bed_room: 2,
        status: 'Rented',
        selling_price: 750000,
        max_no_of_people: 4,
        description: 'Spacious two bedroom apartment',
      },
    }),
    prisma.room.create({
      data: {
        room_no: 201,
        floor: 2,
        dimension: '10x8 ft',
        no_of_bed_room: 1,
        status: 'Available',
        selling_price: 400000,
        max_no_of_people: 1,
        description: 'Compact single room for students',
      },
    }),
    prisma.room.create({
      data: {
        room_no: 202,
        floor: 2,
        dimension: '14x11 ft',
        no_of_bed_room: 1,
        status: 'InMaintenance',
        selling_price: 600000,
        max_no_of_people: 2,
        description: 'Premium single bedroom with balcony',
      },
    }),
    prisma.room.create({
      data: {
        room_no: 301,
        floor: 3,
        dimension: '18x14 ft',
        no_of_bed_room: 3,
        status: 'Available',
        selling_price: 1000000,
        max_no_of_people: 6,
        description: 'Large family apartment with city view',
      },
    }),
  ]);

  // 3. Seed Tenants
  const tenants = await Promise.all([
    prisma.tenant.create({
      data: {
        names: ['John Doe', 'Jane Doe'],
        emails: ['john.doe@email.com', 'jane.doe@email.com'],
        nrcs: ['12/ABCD(N)123456', '11/ABCD(N)654321'],
        phone_nos: ['+95912345678', '+95987654321'],
        emergency_nos: ['+95911111111', '+95922222222'],
        room_id: rooms[0].id, // Room 101
      },
    }),
    prisma.tenant.create({
      data: {
        names: ['Alice Smith'],
        emails: ['alice.smith@email.com'],
        nrcs: ['14/WXYZ(N)789012'],
        phone_nos: ['+95913456789'],
        emergency_nos: ['+95933333333'],
        room_id: rooms[1].id, // Room 102
      },
    }),
  ]);

  // 4. Seed Users
  const adminPassword = await hashPassword('admin123');
  const staffPassword = await hashPassword('staff123');
  const tenantPassword = await hashPassword('tenant123');

  const users = await Promise.all([
    // Admin user
    prisma.user.create({
      data: {
        user_name: 'admin',
        email: 'admin@gmail.com',
        password: adminPassword,
        role: 'Admin',
      },
    }),
    // Staff user
    prisma.user.create({
      data: {
        user_name: 'staff',
        email: 'staff@gmail.com',
        password: staffPassword,
        role: 'Staff',
      },
    }),
    // Tenant users
    prisma.user.create({
      data: {
        user_name: 'johndoe',
        email: 'johndoe@email.com',
        password: tenantPassword,
        role: 'Tenant',
        tenant_id: tenants[0].id,
      },
    }),
    prisma.user.create({
      data: {
        user_name: 'alice',
        email: 'alice@email.com',
        password: tenantPassword,
        role: 'Tenant',
        tenant_id: tenants[1].id,
      },
    }),
  ]);

  // 5. Seed Contracts
  const contracts = await Promise.all([
    prisma.contract.create({
      data: {
        contract_id: contractTypes[1].id, // 12 months
        expiry_date: new Date('2025-10-01'),
        created_date: new Date('2024-10-01'),
        updated_date: new Date('2024-10-01'),
        room_id: rooms[0].id,
      },
    }),
    prisma.contract.create({
      data: {
        contract_id: contractTypes[0].id, // 6 months
        expiry_date: new Date('2025-04-01'),
        created_date: new Date('2024-10-01'),
        updated_date: new Date('2024-10-01'),
        room_id: rooms[1].id,
      },
    }),
  ]);

  // 6. Seed Customer Services
  const customerServices = await Promise.all([
    prisma.customerService.create({
      data: {
        description: 'Air conditioning not working properly',
        category: 'Maintenance',
        status: 'Ongoing',
        priority_level: 'High',
        room_id: rooms[0].id,
      },
    }),
    prisma.customerService.create({
      data: {
        description: 'Noise complaint from upstairs neighbor',
        category: 'Complain',
        status: 'Pending',
        priority_level: 'Medium',
        room_id: rooms[1].id,
      },
    }),
    prisma.customerService.create({
      data: {
        description: 'WiFi password reset request',
        category: 'Other',
        status: 'Resolved',
        priority_level: 'Low',
        room_id: rooms[0].id,
      },
    }),
  ]);

  // 7. Seed Bills
  const bills = await Promise.all([
    prisma.bill.create({
      data: {
        rental_fee: 280000,
        electricity_fee: 25000,
        water_fee: 8000,
        fine_fee: 0,
        service_fee: 5000,
        ground_fee: 2000,
        car_parking_fee: 10000,
        wifi_fee: 15000,
        total_amount: 345000,
        due_date: new Date('2025-11-01'),
        created_at: new Date('2025-10-01'),
        updated_at: new Date('2025-10-01'),
        room_id: rooms[0].id,
      },
    }),
    prisma.bill.create({
      data: {
        rental_fee: 300000,
        electricity_fee: 30000,
        water_fee: 12000,
        fine_fee: 5000,
        service_fee: 5000,
        ground_fee: 2000,
        car_parking_fee: null,
        wifi_fee: 15000,
        total_amount: 369000,
        due_date: new Date('2025-11-01'),
        created_at: new Date('2025-10-01'),
        updated_at: new Date('2025-10-01'),
        room_id: rooms[1].id,
      },
    }),
    prisma.bill.create({
      data: {
        rental_fee: 100000,
        electricity_fee: 10000,
        water_fee: 1000,
        fine_fee: 1000,
        service_fee: 1000,
        ground_fee: 1000,
        car_parking_fee: null,
        wifi_fee: 1000,
        total_amount: 1000,
        due_date: new Date('2025-12-01'),
        created_at: new Date('2025-9-01'),
        updated_at: new Date('2025-9-01'),
        room_id: rooms[2].id,
      },
    }),
  ]);

  // 8. Seed Total Units
  const totalUnits = await Promise.all([
    prisma.totalUnits.create({
      data: {
        electricity_units: 125.5,
        water_units: 45.2,
        created_at: 1696118400, // Unix timestamp
        bill_id: bills[0].id,
      },
    }),
    prisma.totalUnits.create({
      data: {
        electricity_units: 150.8,
        water_units: 62.1,
        created_at: 1696118400, // Unix timestamp
        bill_id: bills[1].id,
      },
    }),
  ]);

  // 9. Seed Invoices
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        status: 'Paid',
        bill_id: bills[0].id,
      },
    }),
    prisma.invoice.create({
      data: {
        status: 'Pending',
        bill_id: bills[1].id,
      },
    }),
    prisma.invoice.create({
      data: {
        status: 'Paid',
        bill_id: bills[2].id,
      },
    }),
  ]);

  // 10. Seed Receipts
  const receipts = await Promise.all([
    prisma.receipt.create({
      data: {
        payment_method: 'Mobile_Banking',
        paid_date: new Date('2025-10-02'),
        invoice_id: invoices[0].id,
      },
    }),
    prisma.receipt.create({
      data: {
        payment_method: 'Cash',
        paid_date: new Date('2025-10-01'),
        invoice_id: invoices[1].id,
      },
    }),
  ]);

  console.log('Database seeding completed successfully!');
  console.log(`Created:
  - ${contractTypes.length} contract types
  - ${rooms.length} rooms
  - ${tenants.length} tenants
  - ${users.length} users
  - ${contracts.length} contracts
  - ${customerServices.length} customer services
  - ${bills.length} bills
  - ${totalUnits.length} total units records
  - ${invoices.length} invoices
  - ${receipts.length} receipts`);
=======
  // Seed admin user
  console.log('Seeding admin user...');
  const adminEmail = 'admin@gmail.com';
  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  const hashedPassword = await hashPassword(adminPassword);
  await prisma.user.create({
    data: {
      user_name: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: 'Admin',
    },
  });
  console.log('Admin user seeded successfully.');
>>>>>>> acd6a94 (Auth&User API merge checked)
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
