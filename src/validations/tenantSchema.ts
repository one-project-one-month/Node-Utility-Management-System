import z from 'zod';

export const CreateTenantSchema = z.object({
  names: z.array(z.string().min(3, 'Name cannot be empty')),
  emails: z.array(z.email('Invalid email')),
  nrcs: z.array(z.string().min(7, 'NRC too short')),
  phone_nos: z.array(z.string().min(6)),
  emergency_nos: z.array(z.string().min(6)),
  room_id: z.uuid({ version: 'v4' }),
  user_id: z.uuid({ version: 'v4' }),
});

export type CreateTenantType = z.infer<typeof CreateTenantSchema>;
