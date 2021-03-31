export default function dateFormate(value, format = 'date'){
  const options = {}
  console.log('datevalue', value)
  if(format.includes('date')){
    options.day = '2-digit' // параметр отображения numeric | 2-digit
    options.month = '2-digit' // параметр отображения long | 2-digit
    options.year = 'numeric' // параметр отображения numeric | 2-digit
  }
  if (format.includes('time')) {
    options.hour = '2-digit' // параметр отображения numeric | 2-digit
    options.minute = '2-digit' // параметр отображения numeric | 2-digit
    options.second = '2-digit' // параметр отображения numeric | 2-digit
  }
  return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value))
}