const niceFilter = [
  { fn: Date.prototype.getYear, nice: "년" },
  { fn: Date.prototype.getMonth, nice: "달" },
  { fn: Date.prototype.getDate, nice: "일" },
  { fn: Date.prototype.getHours, nice: "시간" },
  { fn: Date.prototype.getMinutes, nice: "분" },
  { fn: Date.prototype.getSeconds, nice: "초" },
];

const diff = (modifiedDate, today) => {
  return (diffFn) => {
    return diffFn.call(today) - diffFn.call(modifiedDate);
  }
}

export default (date) => {
  const lastModifiedDate = new Date(date);
  const today = new Date();
  const differ = diff(lastModifiedDate, today);

  return niceFilter.reduce((accum, { fn, nice }) => {
    if(accum) return accum;
    const d = differ(fn);
    return d === 0 ? null : `${d}${nice} 전` ;
  }, null);
}