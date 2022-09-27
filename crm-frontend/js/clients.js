import {getList} from './repository.js';
import {getListForTable} from './repository.js';
import {getRowTable} from './repository.js';
 
import {getClient} from './repository.js';
import {saveClient} from './repository.js';
import {sortTable} from './sortingData.js';
import {filterData} from './filterData.js'
import {validation} from './validation.js'

(() => {

 var masktel = new Inputmask("+7 (999)-999-99-99");
 let clientsList = [];

  function createRow(client, { onSave, onDelete }) {
    let row = document.createElement('tr');
    row.classList.add('tr__row');
    let rowId = document.createElement('td');
    rowId.textContent = client.id;
    rowId.classList.add('td__client-id');
    rowId.classList.add('td__row');

    let rowFio = document.createElement('td');
    rowFio.classList.add('td__row');
    rowFio.classList.add('td__client-fio');
    rowFio.textContent = client.fio;

    let rowDataCreate = document.createElement('td');
    rowDataCreate.classList.add('td__row');
    rowDataCreate.classList.add('td__data-create');
    let divDateCr= document.createElement('div');
    divDateCr.classList.add('div_date');
    // rowDataCreate.textContent = client.dataCr;
    let dateCr = document.createElement('span');
    dateCr.classList.add('td_date');
    dateCr.textContent = client.dataCr;
    divDateCr.appendChild(dateCr);
    let timeCr = document.createElement('span');
    timeCr.classList.add('td_time');
    timeCr.textContent = client.timeCr;
    divDateCr.appendChild(timeCr);
    rowDataCreate.appendChild(divDateCr);

    let rowDataUpdate = document.createElement('td');
    rowDataUpdate.classList.add('td__row');
    rowDataUpdate.classList.add('td__data-update');
    // rowDataUpdate.textContent = client.dataUp;
    let divDateUp= document.createElement('div');
    divDateUp.classList.add('div_date');
    let dateUp = document.createElement('span');
    dateUp.classList.add('td_date');
    dateUp.textContent = client.dataUp;
    divDateUp.appendChild(dateUp);
    let timeUp = document.createElement('span');
    timeUp.classList.add('td_time');
    timeUp.textContent = client.timeUp;
    divDateUp.appendChild(timeUp);
    rowDataUpdate.appendChild(divDateUp);

    let rowContacts = document.createElement('td');
    rowContacts.classList.add('td__row');
    let divtooltips = document.createElement('div');
    divtooltips.classList.add('mytooltip');
    divtooltips.setAttribute('id', 'mytooltip');
    client.contacts.forEach(value => {
    let tooltip = createTooltips(value);
    divtooltips.appendChild(tooltip);
    });
    rowContacts.appendChild(divtooltips);

    let rowBtns = document.createElement('td');
    rowBtns.classList.add('td__row');
    let divBtns = document.createElement('div');
    divBtns.classList.add('td__btns');
    let rowBtnUpdate = document.createElement('button');
    let rowBtnDelete = document.createElement('button');
    rowBtnUpdate.classList.add('td__btn-update');
    // rowBtnUpdate.classList.add('js-open-modal');
    rowBtnUpdate.setAttribute("data-modal", '1')
    rowBtnUpdate.textContent = "Изменить";

    rowBtnDelete.classList.add('td__btn-del');
    // rowBtnDelete.classList.add('js-open-modal');
    rowBtnDelete.setAttribute('data-modal', '2')
    rowBtnDelete.textContent = "Удалить";

    rowBtnUpdate.addEventListener('click', async () => {
      let editClient = await getClient(client.id);
      createModalForm( editClient, row, { onSave, onDelete })
    });

    rowBtnDelete.addEventListener('click', function () {
      createModalAlert( client, row , { onSave, onDelete });
    });
    divBtns.appendChild(rowBtnUpdate);
    divBtns.appendChild(rowBtnDelete);
    rowBtns.appendChild(divBtns);

    row.appendChild(rowId);
    row.appendChild(rowFio);
    row.appendChild(rowDataCreate);
    row.appendChild(rowDataUpdate);
    row.appendChild(rowContacts);
    row.appendChild(rowBtns);
    return row;
  }

   function createTable(list) {
    const table = document.getElementById('listClients');

    const tbody = document.createElement('tbody');
    tbody.classList.add('item-client') ;
    tbody.setAttribute('id', 'item-Client')
   
    const handlers = getHandlers();

    for (let item of list) {

      const row = createRow(item, handlers);
      tbody.appendChild(row);

    }
    table.appendChild(tbody);
  }

  function getHandlers() {
    const handlers = {
      async onSave(client) {
        const antword = await saveClient(client);
        // updateRow(a, row);
        refreshTable(antword);
      },
      onDelete( editClient, row ) {
        row.remove();
        let index = clientsList.findIndex(cl => cl.id === editClient.id);
        clientsList.splice(index,1);
        fetch(`http://localhost:3000/api/clients/${editClient.id}`, {
          method: 'DELETE',
        })
      },
    }
    return handlers;
  }

  function createModalForm(editClient, row , { onSave, onDelete }) {

    const container = document.getElementById('container');

    const modalform = document.createElement('div');
    modalform.classList.add('modal');
    modalform.classList.add('active');

    const overlay = document.querySelector('.js-overlay-modal');
    overlay.classList.add('active');

    const btnClose = document.createElement('button');
    btnClose.classList.add('btn-close');
    btnClose.addEventListener('click', function () {
      closeModalForm(modalform);
    });

    const form = document.createElement('form');
    form.classList.add('edit-form');

    // const formfieldset = document.createElement('fieldset');
    // formfieldset.classList.add('modal__edit-fieldset');

    const formdiv = document.createElement('div');
    formdiv.classList.add('form-heading');
    const formspanText = document.createElement('span');
    formspanText.classList.add('edit-form__legend');
    formspanText.textContent = 'Новый клиент';
    const formspanid = document.createElement('span');
    formspanid.classList.add('clientID');

    formdiv.appendChild(formspanText);
    formdiv.appendChild(formspanid);
    form.appendChild(formdiv);

    const forminp = document.createElement('div');
    forminp.classList.add('form-inputs');
    //фамилия
    const labalSurName = document.createElement('label');
    labalSurName.classList.add('edit-form__label');
    labalSurName.textContent = 'Фамилия*'
    const inputSurName = document.createElement('input');
    inputSurName.classList.add('edit-form__input');
    inputSurName.setAttribute('id', 'surName');
    inputSurName.setAttribute('name', 'surName');
    // inputSurName.setAttribute('required', 'true');

    forminp.appendChild(labalSurName);
    forminp.appendChild(inputSurName);

    //имя
    const labalName = document.createElement('label');
    labalName.classList.add('edit-form__label');
    labalName.textContent = 'Имя*'
    const inputName = document.createElement('input');
    inputName.classList.add('edit-form__input');
    inputName.setAttribute('id', 'name');
    inputName.setAttribute('name', 'name');
    // inputName.setAttribute('required', 'true');

    forminp.appendChild(labalName);
    forminp.appendChild(inputName);

    //Отчество
    const labalmiddleName = document.createElement('label');
    labalmiddleName.classList.add('edit-form__label');
    labalmiddleName.textContent = 'Отчество'
    const inputmiddleName = document.createElement('input');
    inputmiddleName.classList.add('edit-form__input');
    inputmiddleName.setAttribute('id', 'middleName');
    inputmiddleName.setAttribute('name', 'middleName');

    forminp.appendChild(labalmiddleName);
    forminp.appendChild(inputmiddleName);

    form.appendChild(forminp);

    //контакты
    const contactdiv = document.createElement('div');
    contactdiv.classList.add('add-contact');
    const list = document.createElement('div');
    // list.classList.add('scrollbar');
    const btnAddContact = document.createElement('button');
    btnAddContact.classList.add('add-contact__btn');
    btnAddContact.addEventListener('click', e => {
      e.preventDefault();

      let countTypes = document.querySelectorAll('.type-contact');
      if (countTypes.length !== 10)
      {
        list.classList.add('list-contacts');
        let contact = createContactInfoBlok(null);
        list.appendChild(contact);
      }

      });

    const btnsvg = document.createElement('span');
    btnsvg.classList.add('add-contact__svg');
    btnsvg.textContent = 'Добавить контакт';

    btnAddContact.appendChild(btnsvg);

    //buttons
    const buttonsdiv = document.createElement('div');
    buttonsdiv.classList.add('edit-form__btns');
    const divError = document.createElement('div');
    divError.classList.add('edit-form__error');
    divError.setAttribute('id', 'errorMessage');
    buttonsdiv.appendChild(divError);
    const btnSave = document.createElement('button');
    btnSave.classList.add('edit-form__btn-save');
    btnSave.textContent = 'Сохранить';
    btnSave.setAttribute('type', 'submit');

    buttonsdiv.appendChild(btnSave);

    if (editClient) {

      formspanText.textContent = "Изменить данные";
      formspanid.textContent = `ID: ${editClient.id}`;
      inputName.value = editClient.name;
      inputSurName.value = editClient.surname;
      inputmiddleName.value = editClient.lastName;


      editClient.contacts.forEach(value => {

        list.classList.add('list-contacts');
        let chois = createContactInfoBlok(value);
        list.appendChild(chois);
      });

      const btndelete = document.createElement('button');
      btndelete.classList.add('btn-link');
      btndelete.textContent = 'Удалить клиента';
      btndelete.addEventListener('click', function () {
        // onDelete({client,row});
        closeModalForm(modalform);
        createModalAlert( editClient, row, { onDelete })
      });
      buttonsdiv.appendChild(btndelete);
    }
    else {
      const btnCensel = document.createElement('button');
      btnCensel.classList.add('btn-link');
      btnCensel.textContent = 'Отмена';
      btnCensel.addEventListener('click', function () {
        closeModalForm(modalform);
      });
      buttonsdiv.appendChild(btnCensel);
    }

    contactdiv.appendChild(list);
    
    contactdiv.appendChild(btnAddContact);
    form.appendChild(contactdiv);

    form.appendChild(buttonsdiv);

    form.addEventListener('submit', e => {
      e.preventDefault();
      if(!validation())
        return;
      const data = new FormData(e.target);
      let contacts = [];
      let typeText = data.getAll('type-text');
      let selectType = data.getAll('select-type');
      if (typeText.length > 0 && typeText[0] !== "") {
        for (let i = 0; i < selectType.length; i++) {
          let type = selectType[i] === '' ? 'tel' : selectType[i];
          let obj = {
            type: `${type}`,
            value: `${typeText[i]}`
          }
          contacts.push(obj);
        }
      }
      let client = {
        id: editClient === null ? 0 : editClient.id,
        name: data.get('name'),
        surname: data.get('surName'),
        middleName: data.get('middleName'),
        contacts: contacts
      };
      onSave(client);
      // closeModalForm(modalform);
    });

    // form.appendChild(form);
    modalform.appendChild(btnClose);
    modalform.appendChild(form);
    container.appendChild(modalform);

  }

  async function refreshTable({code, message})
  { 
    const modalform = document.querySelector('.modal')
    if(code === 200 || code === 201) {
      closeModalForm(modalform);
      await loadClientList();
      displayTable(sortInfo.sortType,true);
    }
    else {
      let error = '"Что-то пошло не так..."';
      if(message != null || message != undefined)
        error = message;
      let divError = document.getElementById('errorMessage');
      divError.textContent = `Ошибка : ${message}`;
      }
  }

  // function updateRow(client,row)
  // {
  //   let newRow = getRowTable(client);
  //   if(row) {
  //     let index = clientsList.findIndex(cl => cl.id === client.id);
    
  //     clientsList[index] = newRow;
  //     row.cells[0].innerText = newRow.id;
  //     row.cells[1].innerText = newRow.fio;
  //     row.cells[2].innerText = `${newRow.dataCr}\n${newRow.timeCr}`;
  //     row.cells[3].innerText = `${newRow.dataUp}\n${newRow.timeUp}`;
  
  //     const divtooltips = row.cells[4].childNodes[0];
  //     while(divtooltips.firstChild) {
  //       divtooltips.firstChild.remove();
  //     }
  //     newRow.contacts.forEach(value => {
  //     let tooltip = createTooltips(value);
  //     divtooltips.appendChild(tooltip);
  //     });
  //   }
  //  else {
  //   clientsList.push(newRow) ;
  //   const tbody = document.getElementById('item-Client');
  //   const row1 = createRow(newRow, getHandlers());
  //   tbody.appendChild(row1);
  //  }
   
  // }

  function createModalAlert(client, row , { onDelete }) {
    const container = document.getElementById('container');

    const modalform = document.createElement('div');
    modalform.classList.add('modal');
    modalform.classList.add('active');

    const overlay = document.querySelector('.js-overlay-modal');
    overlay.classList.add('active');

    const btnClose = document.createElement('button');
    btnClose.classList.add('btn-close');
    btnClose.addEventListener('click', function () {
      closeModalForm(modalform);
    });

    const header = document.createElement('h2');
    header.textContent = 'Удалить клиента';
    const quastion = document.createElement('p');
    quastion.textContent = 'Вы действительно хотите удалить данного клиента?';
    const buttonsdiv = document.createElement('div');
    buttonsdiv.classList.add('edit-form__btns');
    const btndelete = document.createElement('button');
    btndelete.classList.add('edit-form__btn-save');
    btndelete.textContent = 'Удалить';
    btndelete.addEventListener('click', function () {
      onDelete(client, row);
      closeModalForm(modalform);
    });
    const btnCensel = document.createElement('button');
    btnCensel.classList.add('btn-link');
    btnCensel.textContent = 'Отмена';
    btnCensel.addEventListener('click', function () {
      closeModalForm(modalform);
    });
    buttonsdiv.appendChild(btndelete);
    buttonsdiv.appendChild(btnCensel);

    modalform.appendChild(btnClose);
    modalform.appendChild(header);
    modalform.appendChild(quastion);
    modalform.appendChild(buttonsdiv);
    container.appendChild(modalform);
  }

  function closeModalForm(modalform) {
    modalform.remove();
    const overlay = document.querySelector('.js-overlay-modal');
    overlay.classList.remove('active');
  }
 
  function createContactInfoBlok(choisValue) {
    const div = document.createElement('div');
    div.classList.add('type-contact');
    const divSelecter = document.createElement('div');
    divSelecter.classList.add('selecter');
    const choices = document.createElement('select');
    choices.classList.add('choices');
    choices.setAttribute('id', 'choices');
    choices.setAttribute('name', 'select-type');

    const option = document.createElement('option');
    option.setAttribute('value', 'tel');
    option.textContent = 'Телефон';

    const option2 = document.createElement('option');
    option2.setAttribute('value', 'email');
    // option3.setAttribute('selected', true);
    option2.textContent = 'Email';


    const option3 = document.createElement('option');
    option3.setAttribute('value', 'fb');
    option3.textContent = 'Facebook';

    const option4 = document.createElement('option');
    option4.setAttribute('value', 'vk');
    option4.textContent = 'Vk';

    const option5 = document.createElement('option');
    option5.setAttribute('value', 'other');
    option5.textContent = 'Другое'


    choices.appendChild(option);
    choices.appendChild(option2);
    choices.appendChild(option3);
    choices.appendChild(option4);
    choices.appendChild(option5);


    divSelecter.appendChild(choices);

    const btnCenselinput = document.createElement('div');
    btnCenselinput.classList.add('btn-censel');
    btnCenselinput.classList.add('mytooltip');
    let tooltip = createTooltips({type: 'delete', value: ""});
    btnCenselinput.appendChild(tooltip);
    // const btnspan = document.createElement('span');
    // btnspan.classList.add('btn-censel__svg');
    // btnCenselinput.appendChild(btnspan);
    btnCenselinput.addEventListener('click', function(){
      div.remove();
    });

    const input = document.createElement('input');
    input.classList.add('type-contact__input');
    input.setAttribute('type', 'tel');
    input.setAttribute('placeholder', 'Введите данные контакта');
    // input.setAttribute('required', 'true');
    input.setAttribute('name', 'type-text');


    input.addEventListener('input', function(){
      btnCenselinput.classList.add('active');
    });
    masktel.mask(input);
    div.appendChild(divSelecter);

    const ex = new Choices(choices, {
      searchEnabled: false,
      shouldSort: false,
      itemSelectText: '',
      position: 'auto'
    });
    choices.addEventListener(
      'change',
      function(event) {
        console.log(event.detail.value);
       if(event.detail.value === 'tel')
       {
        input.setAttribute('type', 'tel');
        masktel.mask(input);
       }
       else
       {
        if (input.inputmask)
          input.inputmask.remove();
        // input.setAttribute('type', 'text');
        // masktel.mask.remove(input);
       }
      },
      false,
    );
    if (choisValue)
    {
      ex.setChoiceByValue(choisValue.type);
      if(choisValue.type !== 'tel')
        input.inputmask.remove();
      input.value = choisValue.value;
      btnCenselinput.classList.add('active');
    }
    div.appendChild(input);
    div.appendChild(btnCenselinput);
    return div;
  }

  function createTooltips(value)
  {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    const marker = document.createElement('button');
    marker.classList.add('marker');
    marker.classList.add(`marker-${value.type}`);

    const div = document.createElement('div');
    div.classList.add('popup');
    let text ='';
    switch (value.type) {
      case "tel":
        text = 'Телефон : ';
        break;
      case "email":
        text = 'Email : ';
        break;
      case "vk":
        text = 'Вконтакте : ';
        break;
      case "other":
        text = 'Другое : ';
        break;
      case "fb":
        text = 'Facebook : ';
        break;
      case "delete":
        text = 'Удалить контакт';
        break;  
    }
    text += value.value
    div.textContent = text;
    tooltip.appendChild(marker);
    tooltip.appendChild(div);

    return tooltip;
  }

  async function firstLoad()
  {
    await loadClientList();
    displayTable('id',false);
  }

  async function loadClientList(){
    const list = await getList();
     clientsList = getListForTable(list);
  }

  let sortInfo = {sortType : null,
                  isUp : null};
  async function displayTable(sortType , isReload)
  {
    const tbody = document.getElementById('item-Client');
    if(tbody)
      tbody.remove();
     
     let filter = document.getElementById('filter');
     let list = clientsList.slice();
     if(filter.value !== '')
      list = filterData(filter.value, list);

      if(!isReload)
        sortInfo.sortType = sortType; 
      
     list = await sortTable(sortInfo, list,isReload);
     createTable(list);
  }

  let interval;
 
  function filter(value)
  {
    clearInterval(interval);
    let list = filterData(value, clientsList);
    
    const tbody = document.getElementById('item-Client');
    if(tbody)
      tbody.remove();
    createTable(list);
   
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add').addEventListener('click', function (event) {
      createModalForm(null,null, getHandlers());
    });
    
    firstLoad();

    document.getElementById('btnSort_id').addEventListener('click', function (event) {
      event.preventDefault();
      // sortID();
      displayTable('id',false);

    });

    document.getElementById('btnSort_fio').addEventListener('click', function (event) {
      event.preventDefault();
      // sortFio();
      displayTable('fio',false);
    });

    document.getElementById('btnSort_cteateDate').addEventListener('click', function (event) {
      event.preventDefault();
      // sortCteateDate();
      displayTable('cteateDate',false);
    });

    document.getElementById('btnSort_updateDate').addEventListener('click', function (event) {
      event.preventDefault();
      displayTable('updateDate',false);
    });

    document.getElementById('filter').addEventListener('input', function (event) {
      clearInterval(interval);
      interval  = setInterval(filter, 1000, this.value);
     
    });

  });
})();
