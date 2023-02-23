export default function fieldHandler() {
  const addField = (fieldsArray) => {
    fieldsArray.push({
      id: Math.random(),
      type: '',
      title: 'Overskrift',
      value: ''
    });
  }

  const addFieldDirectory = (fieldsArray) => {
    fieldsArray.push({
      id: Math.random(),
      title: '',
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

  const getDataDirectoryIdentifier = (data) => {
    if (data['identification']) {
      return data[data['identification']]
    } else {
      return Object.values(data)[1];
    }
  }

  return {
    addField, deleteField, capitalizeString, addFieldDirectory, getDataDirectoryIdentifier
  }
}