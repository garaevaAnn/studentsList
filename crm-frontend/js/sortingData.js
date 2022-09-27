// import {getList} from './repository.js';
// import {getListForTable} from './repository.js';

function byFieldUp(field) {
  return (a, b) => a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1;
}
function byFieldDown(field) {
  return (a, b) => a[field].toLowerCase() < b[field].toLowerCase() ? 1 : -1;
}


export async function sortTable(sortInfo, arrfortable,isReload) {
  let isUp;
  const btn = document.getElementById(`btnSort_${sortInfo.sortType}`);
  const btns = document.querySelectorAll('.table-header__btn');
  btns.forEach(item => {
    if(item != btn && item.className.includes('sorted'))
      item.classList.remove('sorted');
  });
  
  if(!isReload){
    if (btn.className.includes('sorted')) {
      btn.classList.remove('sorted');
      isUp = false;
    }
    else {
      btn.classList.add('sorted');
      isUp = true;
    }  
  }
  else 
    isUp = sortInfo.isUp
 
  if (isUp) {
    if (sortInfo.sortType === 'cteateDate') {
      arrfortable.sort(function (a, b) {
        return a.createdAtObj - b.createdAtObj;
      })
    }
    else if (sortInfo.sortType === 'updateDate') {
      arrfortable.sort(function (a, b) {
        return a.updatedAtObj - b.updatedAtObj;
      })
    }
    else
      arrfortable.sort(byFieldUp(sortInfo.sortType));
  }
  else {
    if (sortInfo.sortType === 'cteateDate') {
      arrfortable.sort(function (a, b) {
        return b.createdAtObj - a.createdAtObj;
      })
    }
    else if (sortInfo.sortType === 'updateDate') {
      arrfortable.sort(function (a, b) {
        return b.updatedAtObj - a.updatedAtObj;
      })
    }
    else
      arrfortable.sort(byFieldDown(sortInfo.sortType));
  }

  sortInfo.isUp = isUp;

  return arrfortable;
}
