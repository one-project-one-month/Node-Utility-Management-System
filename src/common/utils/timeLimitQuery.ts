import moment from 'moment';
import { GetBillQueryType } from './../../validations/billSchema';

export default function getTimeLimitQuery(query: GetBillQueryType) {
  const { month, year } = query;
  const startDate = moment(`${month} ${year}`, 'MMM YYYY')
    .startOf('month')
    .toDate();
  const endDate = moment(`${month} ${year}`, 'MMM YYYY')
    .endOf('month')
    .toDate();
  return { startDate, endDate };
}
