export function validation() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach(value => {
        value.classList.remove('error');
    });

    let inputSurName = document.getElementById('surName');
    let inputName = document.getElementById('name');
    let inputsType = document.querySelectorAll('.type-contact__input')
    let error = document.getElementById('errorMessage');
    if (inputSurName.value === '') {
        inputSurName.classList.add('error');
        error.textContent = "Ошибка:Введите фамилию!"
        return false;
    }
    else if (inputName.value === '') {
        inputName.classList.add('error');
        error.textContent = "Ошибка: Введите имя!"
        return false;
    }
    else if (inputsType.length > 0) {
        for (let i = 0; i < inputsType.length; i++) {
            if (inputsType[i].value === "") {
                inputsType[i].classList.add('error');
                error.textContent = "Ошибка: Введите контакт!"
                return false;
            }
        }
    }
    return true;
}