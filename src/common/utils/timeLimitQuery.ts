import moment from 'moment';

export default function getTimeLimitQuery(month?: string, year?: string) {
  const startDate = moment(`${month} ${year}`, 'MMM YYYY')
    .startOf('month')
    .toDate();
  const endDate = moment(`${month} ${year}`, 'MMM YYYY')
    .endOf('month')
    .toDate();

  return { startDate, endDate };
}
