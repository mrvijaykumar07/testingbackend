import moment from "moment-timezone";
const IST = 'Asia/Kolkata';

export const nowIST = () => moment().tz(IST);
export const formatIST = () => nowIST().format('YYYY-MM-DD HH:mm:ss');
export const addDaysIST = (days) => nowIST().add(days, 'days').format('YYYY-MM-DD HH:mm:ss');