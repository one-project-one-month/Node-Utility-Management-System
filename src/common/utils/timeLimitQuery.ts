import moment from 'moment';
import { GetInvoiceQueryType } from '../../validations/invoiceSchema';

export default function getTimeLimitQuery(query: GetInvoiceQueryType) {
  const { month, year } = query;

  if (!month || !year) {
    return { startDate: undefined, endDate: undefined };
  }

  const startDate = moment(`${month} ${year}`, 'MMM YYYY')
    .startOf('month')
    .toDate();
  const endDate = moment(`${month} ${year}`, 'MMM YYYY')
    .endOf('month')
    .toDate();

  return { startDate, endDate };
}
