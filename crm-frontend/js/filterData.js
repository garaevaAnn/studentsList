

export function filterData(text, list)
{
    if (text === '')
        return list;
        
    let filterList = [];
    for (let item of list) {
        if(item.fio.toLowerCase().includes(text.toLowerCase()) || 
        item.dataCr.includes(text) ||
        item.dataUp.includes(text))
            filterList.push(item);
        else 
        {
            for (let contact of item.contacts)
            {
                if(contact.value.includes(text))
                {
                    filterList.push(item);
                    break;
                }
            }
        }
    }
  return filterList;
}