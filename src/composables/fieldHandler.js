import { ref } from "vue";

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

  return {
    addField, deleteField, capitalizeString
  }
}