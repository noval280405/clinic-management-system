import numeral from "numeral"
import moment from "moment"
import _ from "lodash"

numeral.register('locale', 'fr', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  ordinal: function (number) {
    return number === 1 ? 'er' : 'ème';
  },
  currency: {
    symbol: '€'
  }
});

numeral.locale('fr')


export const rupiah = (nominal: number) => {
  return numeral(nominal).format('0,0')
}

export const rubahtanggalunix = (unix: number) => {
  return moment.unix(unix).format('YYYY-MM-DD')
}

export const rubahtanggalunixjam = (unix: number) => {
  return moment.unix(unix).format('DD-MMM-YYYY HH:mm')
}

export const rubahtanggalunixjamdetik = (unix: number) => {
  return moment.unix(unix).format('DD-MMM-YYYY HH:mm:ss')
}

export const rubahtanggal = (date: string) => {
  return moment(date).format('DD-MMM-YYYY');
}

export const rubahtanggalinv = (date: string) => {
  return moment(date).format('DD MMM YYYY');
}

export const rubahkejam = (unix: number) => {
  return moment.unix(unix).format('H:mm:ss');
}

export const tanggalunixskrg = () => {
  const tanggalsekarangmoment = moment().unix()
  return tanggalsekarangmoment
}

export const rubahtanggalhari = (tgl: string) => {
  return moment(tgl).format('dddd, DD MMMM YYYY')
}

export const jumlahby = (data: any, by: string) => {
  return _.sumBy(data, by)
}

export const list_sparepart = (data: any, by: string) => {
  return _.sumBy(data, by)
}

export const getdataarray = (data: any, by: string) => {
  return _.sumBy(data, by)
}

export const list_sparepart_seri = (data: any, by: string) => {
  return _.sumBy(data, by)
}

export const umurorderan = (dep_date: number) => {
  const b = moment.unix(dep_date)
  const tanggalsekarangmoment = moment()
  const c = tanggalsekarangmoment.diff(b, 'days')

  return c
}
