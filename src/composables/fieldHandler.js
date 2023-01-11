export default function fieldHandler() {
  const addField = (fieldsArray) => {
    fieldsArray.push({
      id: Math.random(),
      type: '',
      title: 'Overskrift',
      value: ''
    });
  }

  const deleteField = (fieldsArray, index) => {
    fieldsArray.splice(index, 1);
  }

  const capitalizeString = (text) => {
    const firstChar = text.charAt(0).toUpperCase();
    const restOfString = text.slice(1);
    return firstChar + restOfString;
  }

  const formatField = (field, setValues) => {
  let error = false;
    let errorMsg = '';
    let value = field.value;

    if (field.type === 'tal' && value) {
      const regex = /^[\d,]*\.?\d*$/
      if (!regex.test(value)) {
        value = '';
        error = true;
        errorMsg = 'Indtast venligst kun tal'
      }
    }

    return setValues(value, error, errorMsg);
  }

  return {
    addField, deleteField, capitalizeString, formatField
  }
}