import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'

dayjs.extend(isSameOrBefore);

export default dayjs;
