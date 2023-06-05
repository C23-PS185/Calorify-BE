const today = new Date()

function padTo2Digits (num) {
  return num.toString().padStart(2, '0')
}

function formatDate (today) {
  return [
    padTo2Digits(today.getDate()),
    padTo2Digits(today.getMonth() + 1),
    today.getFullYear()
  ].join('-')
}

const year = today.getFullYear()
const month = padTo2Digits(today.getMonth() + 1)
const date = padTo2Digits(today.getDate())
console.log(year)
console.log(month)
console.log(date)
console.log(formatDate(today))
