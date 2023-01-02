export default function colorHandler() {
  const colors = [
    { name: 'green', css: 'bg-primary' },
    { name: 'red', css: 'bg-red-500' },
    { name: 'pink', css: 'bg-pink-500' },
    { name: 'orange', css: 'bg-orange-500' },
    { name: 'yellow', css: 'bg-yellow-500' },
    { name: 'cyan', css: 'bg-cyan-500' },
    { name: 'blue', css: 'bg-blue-500' },
    { name: 'purple', css: 'bg-purple-500' },
    { name: 'gray', css: 'bg-gray-500' },
    { name: 'black', css: 'bg-black' },
  ];

  const getTaskColors = (taskColor) => {
    const color = [];
    switch(taskColor) {
      case 'red':
        color['background'] = 'rgb(239 68 68)';
        color['border'] = 'rgb(220 38 38)';
        color['text'] = '#fff';
        break;
      case 'yellow':
        color['background'] = 'rgb(234 179 8)';
        color['border'] = 'rgb(250 204 21)';
        color['text'] = '#000';
        break;
      case 'pink':
        color['background'] = 'rgb(236 72 153)';
        color['border'] = 'rgb(219 39 119)';
        color['text'] = '#fff';
        break;
      case 'orange':
        color['background'] = 'rgb(249 115 22)';
        color['border'] = 'rgb(234 88 12)';
        color['text'] = '#fff';
        break;
      case 'cyan':
        color['background'] = 'rgb(6 182 212)';
        color['border'] = 'rgb(8 145 178)';
        color['text'] = '#fff';
        break;
      case 'blue':
        color['background'] = 'rgb(59 130 246)';
        color['border'] = 'rgb(37 99 235)';
        color['text'] = '#fff';
        break;
      case 'purple':
        color['background'] = 'rgb(168 85 247)';
        color['border'] = 'rgb(147 51 234)';
        color['text'] = '#fff';
        break;
      case 'black':
        color['background'] = '#000';
        color['border'] = '#000';
        color['text'] = '#fff';
        break;
      case 'gray':
        color['background'] = 'rgb(107 114 128)';
        color['border'] = 'rgb(75 85 99)';
        color['text'] = '#fff';
        break;
      default:
        color['background'] = '#81cd74';
        color['border'] = '#6fba62';
        color['text'] = '#fff';
    }

    return color;
  };

  return {
    getTaskColors,
    colors
  }
}