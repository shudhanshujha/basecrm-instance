export const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero Rupees Only';

  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
    return '';
  };

  const formatIndian = (n: number): string => {
    let str = '';
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    if (crore > 0) str += convert(crore) + ' Crore ';
    
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    if (lakh > 0) str += convert(lakh) + ' Lakh ';
    
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    if (thousand > 0) str += convert(thousand) + ' Thousand ';
    
    if (n > 0) str += convert(n);
    return str.trim();
  };

  const whole = Math.floor(num);
  const paise = Math.round((num - whole) * 100);

  let result = formatIndian(whole) + ' Rupees';
  if (paise > 0) {
    result += ' and ' + formatIndian(paise) + ' Paise';
  }
  return result + ' Only';
};
