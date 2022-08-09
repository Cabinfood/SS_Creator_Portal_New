export const validURL = (str) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

export const onlyNumbers = (str) => {
  return /^[0-9]+$/.test(str);
}

export const diff_minutes = (date2, date1) => {  
  // REQUIRE DATETIME FORMAT FOR DATE1, DATE2
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs / (1000 * 60);
}

export const diff_days = (date2, date1) => {  
  // REQUIRE DATETIME FORMAT FOR DATE1, DATE2  
  var diff_time = date2.getTime() - date1.getTime();
  return diff_time / (1000 * 3600 * 24)
}

export const slugify = (text) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export const delay = async (ms = 1000) => {
  new Promise(resolve => setTimeout(resolve, ms))
}
