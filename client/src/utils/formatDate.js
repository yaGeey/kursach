function formatData(date) {
   const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
   const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone };
   return date.toLocaleString('af-ZA', options);
}

export default formatData;