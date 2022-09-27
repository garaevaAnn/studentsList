Date.prototype.ddmmyyyy = function () {
    let mm = this.getMonth() + 1;
    let dd = this.getDate();
    return [(dd > 9 ? '' : '0') + dd,
    (mm > 9 ? '' : '0') + mm,
    this.getFullYear()].join('.');
  }
  
export  function getListForTable(list) {
    let arrFio = [];
    if (list) {
      for (let client of list) {
      
        arrFio.push(getRowTable(client));
      }
    }
    return arrFio;
  }

export function getRowTable(client)
  {
    let fio = `${client.surname} ${client.name} ${client.lastName}`;
    let dataCreate = new Date(client.createdAt);
    let dataUp = new Date(client.updatedAt);
    let uurCr = `${dataCreate.getHours()} : ${dataCreate.getMinutes() > 9 ? dataCreate.getMinutes() : '0' + dataCreate.getMinutes()}`;
    let uurUp = `${dataUp.getHours()} : ${dataUp.getMinutes() > 9 ? dataUp.getMinutes() : '0' + dataUp.getMinutes()}`;

    let st = {
      fio: fio,
      id: client.id,
      updatedAtObj: dataUp,
      createdAtObj: dataCreate,
      dataCr: dataCreate.ddmmyyyy(),
      timeCr: uurCr,
      dataUp: dataUp.ddmmyyyy(),
      timeUp: uurUp,
      contacts : client.contacts
    }
    return st;
  }

  export async function saveClient(client) {
    let newclient=null;
    let response = null;
    if (client.id !== 0) {
      // client.id = "333";
       response = await fetch(`http://localhost:3000/api/clients/${client.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          // name: document.getElementById('name').value.trim(),
          // surname: document.getElementById('surName').value.trim(),
          // lastName: document.getElementById('middleName').value.trim(),
          name: client.name,
          surname: client.surname,
          lastName: client.middleName,
          contacts: client.contacts
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      newclient = await response.json();
    }
    else {
       response = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        body: JSON.stringify({
          name: client.name,
          surname: client.surname,
          lastName: client.middleName,
          contacts: client.contacts
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      });
      newclient = await response.json();
    }
   
    return {code : response.status,
            message : newclient.message}
  }
  
 export  async function getList() {
    const response = await fetch(`http://localhost:3000/api/clients`);
    const list = await response.json();
    return list;
  }
  
  export async function getClient(id) {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`);
    const client = await response.json();
    return client;
  }
