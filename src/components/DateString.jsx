import { month, weekday } from '../operations'

const DateString = ({ date }) => {
  return `${weekday[date.getDay()]}, ${month[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`
}

export default DateString
