import { faker } from '@faker-js/faker';
import { hashPassword } from '../src/common/auth/password';
import prisma from '../src/lib/prismaClient';

async function main() {
  console.log('🚀 Starting database seeding...');

  // Clear existing data
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

  // 🏷️ Contract Types
  const contractTypes = await prisma.contractType.createMany({
    data: [
      {
        name: '6 Months',
        duration: 6,
        price: 300000,
        facilities: ['WiFi', 'Water', 'Electricity', 'Security'],
      },
      {
        name: '12 Months',
        duration: 12,
        price: 280000,
        facilities: ['WiFi', 'Water', 'Electricity', 'Security', 'Parking'],
      },
      {
        name: '24 Months',
        duration: 24,
        price: 250000,
        facilities: ['WiFi', 'Water', 'Electricity', 'Security', 'Gym'],
      },
    ],
  });
  const allContractTypes = await prisma.contractType.findMany();

  // 🏠 Generate Rooms
  const roomPromises = Array.from({ length: 10 }).map((_, i) =>
    prisma.room.create({
      data: {
        room_no: 400 + i,
        floor: faker.number.int({ min: 1, max: 5 }),
        dimension: `${faker.number.int({ min: 10, max: 20 })}x${faker.number.int({ min: 10, max: 20 })} ft`,
        no_of_bed_room: faker.number.int({ min: 1, max: 3 }),
        status: faker.helpers.arrayElement([
          'Available',
          'Rented',
          'Purchased',
          'InMaintenance',
        ]),
        selling_price: faker.number.int({ min: 200000, max: 1200000 }),
        max_no_of_people: faker.number.int({ min: 1, max: 6 }),
        description: faker.lorem.sentence(),
      },
    })
  );
  const rooms = await Promise.all(roomPromises);

  // 👥 Generate Tenants (only for rented rooms)
  const rentedRooms = rooms.filter((r) => r.status === 'Rented');
  const tenantPromises = rentedRooms.map((room) =>
    prisma.tenant.create({
      data: {
        names: [faker.person.fullName()],
        emails: [faker.internet.email()],
        nrcs: [
          `${faker.number.int({ min: 1, max: 15 })}/ABCD(N)${faker.number.int({ min: 100000, max: 999999 })}`,
        ],
        phone_nos: [`+959${faker.string.numeric(9)}`],
        emergency_nos: [`+959${faker.string.numeric(9)}`],
        room_id: room.id,
      },
    })
  );
  const tenants = await Promise.all(tenantPromises);

  // 👨‍💼 Seed Admin, Staff, Tenant Users
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
        user_name: 'admin1',
        email: 'admin1@gmail.com',
        password: adminPassword,
        role: 'Admin',
      },
      {
        user_name: 'admin2',
        email: 'admin2@gmail.com',
        password: adminPassword,
        role: 'Admin',
      },
      {
        user_name: 'admin3',
        email: 'admin3@gmail.com',
        password: adminPassword,
        role: 'Admin',
      },
      {
        user_name: 'staff',
        email: 'staff@gmail.com',
        password: staffPassword,
        role: 'Staff',
      },
    ],
  });

  // Create Tenant users for seeded tenants
  const userPromises = tenants.map((tenant) =>
    prisma.user.create({
      data: {
        user_name: tenant.names[0].split(' ')[0].toLowerCase(),
        email: tenant.emails[0],
        password: tenantPassword,
        role: 'Tenant',
        tenant_id: tenant.id,
      },
    })
  );
  await Promise.all(userPromises);

  // 📜 Contracts
  const contractPromises = tenants.map((tenant, i) =>
    prisma.contract.create({
      data: {
        contract_type_id: faker.helpers.arrayElement(allContractTypes).id,
        expiry_date: faker.date.future(),
        created_date: faker.date.past(),
        updated_date: new Date(),
        room_id: tenant.room_id,
        tenant_id: tenant.id,
      },
    })
  );
  const contracts = await Promise.all(contractPromises);

  // 🧾 Bills
  const billPromises = rooms.map((room) =>
    prisma.bill.create({
      data: {
        rental_fee: faker.number.int({ min: 100000, max: 400000 }),
        electricity_fee: faker.number.int({ min: 10000, max: 30000 }),
        water_fee: faker.number.int({ min: 5000, max: 20000 }),
        fine_fee: faker.number.int({ min: 0, max: 10000 }),
        service_fee: faker.number.int({ min: 1000, max: 10000 }),
        ground_fee: faker.number.int({ min: 1000, max: 5000 }),
        car_parking_fee: faker.number.int({ min: 0, max: 20000 }),
        wifi_fee: faker.number.int({ min: 5000, max: 15000 }),
        total_amount: faker.number.int({ min: 200000, max: 500000 }),
        due_date: faker.date.future(),
        created_at: new Date(),
        updated_at: new Date(),
        room_id: room.id,
      },
    })
  );
  const bills = await Promise.all(billPromises);

  // ⚡ Total Units
  const totalUnitsPromises = bills.map((bill) =>
    prisma.totalUnits.create({
      data: {
        electricity_units: faker.number.float({
          min: 50,
          max: 200,
          fractionDigits: 1,
        }),
        water_units: faker.number.float({
          min: 20,
          max: 100,
          fractionDigits: 1,
        }),
        created_at: new Date(),
        updated_at: new Date(),
        bill_id: bill.id,
      },
    })
  );
  await Promise.all(totalUnitsPromises);

  // 📃 Invoices
  const invoicePromises = bills.map((bill) =>
    prisma.invoice.create({
      data: {
        status: faker.helpers.arrayElement(['Pending', 'Paid', 'Overdue']),
        bill_id: bill.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    })
  );
  const invoices = await Promise.all(invoicePromises);

  // 💰 Receipts (only for paid invoices)
  const paidInvoices = invoices.filter((i) => i.status === 'Paid');
  const receiptPromises = paidInvoices.map((inv) =>
    prisma.receipt.create({
      data: {
        payment_method: faker.helpers.arrayElement(['Cash', 'Mobile_Banking']),
        paid_date: faker.date.recent(),
        invoice_id: inv.id,
      },
    })
  );
  await Promise.all(receiptPromises);

  // 🛠️ Customer Services
  const servicePromises = rooms.map((room) =>
    prisma.customerService.create({
      data: {
        description: faker.lorem.sentence(),
        category: faker.helpers.arrayElement([
          'Complain',
          'Maintenance',
          'Other',
        ]),
        status: faker.helpers.arrayElement(['Pending', 'Ongoing', 'Resolved']),
        priority_level: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
        issued_date: faker.date.past(),
        room_id: room.id,
      },
    })
  );
  await Promise.all(servicePromises);

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
