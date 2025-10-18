import * as z from 'zod';
import { RelationshipToTenant } from '../../generated/prisma';

export const OccupantBaseSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    nrc: z
      .string()
      .min(5, 'NRC must be at least 5 characters')
      .nullable()
      .optional(),
    relationshipToTenant: z.enum(
      RelationshipToTenant,
      "Relationship must be one of 'SPOUSE','PARENT','CHILD','SIBLING','RELATIVE','FRIEND','OTHER'"
    ),
    tenantId: z.uuid({ version: 'v4' }),
  })
  .strict();

export const CreateOccupantSchema = z
  .array(OccupantBaseSchema)
  .min(1, 'At least one occupant is required')
  .refine(
    (arr) => {
      const firstTenantId = arr[0]?.tenantId;
      return arr.every((item) => item.tenantId === firstTenantId);
    },
    {
      message: 'All occupants must have the same tenant_id',
    }
  );

export const UpdateOccupantSchema = z
  .object({
    name: z.string().min(1, 'Name is required').optional(),
    nrc: z
      .string()
      .min(5, 'NRC must be at least 5 characters')
      .nullable()
      .optional(),
    relationshipToTenant: z
      .enum(
        RelationshipToTenant,
        "Relationship must be one of 'SPOUSE','PARENT','CHILD','SIBLING','RELATIVE','FRIEND','OTHER'"
      )
      .optional(),
    tenantId: z.uuid({ version: 'v4' }),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.nrc !== undefined ||
      data.relationshipToTenant !== undefined,
    {
      message:
        'At least one of name, nrc or relationship_to_tenant must be provided',
    }
  )
  .strict();

export const GetOccupantParamSchema = z.object({
  occupantId: z.uuid({ version: 'v4' }),
});

export const DeleteOccupantSchema = z
  .object({
    tenantId: z.uuid({ message: 'Invalid tenantId' }),
  })
  .strict();

export const GetOccupantByTenantParamSchema = z.object({
  tenantId: z.uuid({ version: 'v4' }),
});

export type CreateOccupantType = z.infer<typeof CreateOccupantSchema>;
export type UpdateOccupantType = z.infer<typeof UpdateOccupantSchema>;
export type GetOccupantParamType = z.infer<typeof GetOccupantParamSchema>;
export type DeleteOccupantType = z.infer<typeof DeleteOccupantSchema>;
export type GetOccupantByTenantParamType = z.infer<
  typeof GetOccupantByTenantParamSchema
>;
