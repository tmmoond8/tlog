const dateFilter = [
  { unit: 86400000, postfix: '일' },
  { unit: 3600000, postfix: '시간' },
  { unit: 60000, postfix: '분' },
  { unit: 1000, postfix: '초' },
];

export const getDateGoodLook = (lastModifiedDate: string) => {
  const lastDateTime = new Date(lastModifiedDate).getTime() + 3600000 * 9;
  if (Number.isNaN(lastDateTime) || lastDateTime < 1502769377613) {
    return '';
  }
  const diffTime = new Date().getTime() - lastDateTime;
  const lastDate = new Date(lastDateTime);
  const [year, month, date] = [
    lastDate.getFullYear(),
    lastDate.getMonth() + 1,
    lastDate.getDate(),
  ];

  if (diffTime < 60 * 1000) {
    return '방금 전';
  }

  if (year !== new Date().getFullYear()) {
    return `${year}년 ${month}월 ${date}일`;
  }

  if (diffTime > 9 * 24 * 60 * 60 * 1000) {
    return `${month}월 ${date}일`;
  }

  return dateFilter.reduce((accum, { unit, postfix }) => {
    if (accum) return accum;
    const d = Math.floor(diffTime / unit);
    if (d !== 0) {
      return `${d}${postfix} 전`;
    }
    return '';
  }, '');
};

export const toSafeUrlStr = (url: string) =>
  url.replace(/\t/g, '_').toLocaleLowerCase();
