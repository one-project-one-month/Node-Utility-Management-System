import z from "zod";
import { Category, PriorityLevel, ServiceStatus } from "../../generated/prisma";

export const AnalyticsServiceQuerySchema = z.object({
  query: z.enum(['priority', 'category', 'status'], "Query must be one of priority, category or status."),
  status: z
    .enum(
      ServiceStatus,
      "Category must be one of Pending, Ongoing, or Resolved"
    )
    .optional(),
})

export type AnalyticsServiceCount = z.infer<typeof AnalyticsServiceQuerySchema>
// {
//   countByPriority: {
//     high: number;
//     medium: number;
//     low: number;
//   };
//   countByCategory: {
//     complain: number;
//     maintenance: number;
//     other: number;
//   };
//  countByStatus: {
//     pending: {
//     all:number,
//     high:number,
//     medium:number,
//     low:number,
// };
//     ongoing:  {
//     all:number,
//     high:number,
//     medium:number,
//     low:number,
// };
//     resolved:  {
//     all:number,
//     high:number,
//     medium:number,
//     low:number,
// };;
//   from: "10.7.2025",
//  to:"15.10.2025"
// }