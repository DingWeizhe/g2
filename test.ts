const G2 = require('./index');
const Canvas = require('canvas');
const fs = require('fs');

let canvas = Canvas.createCanvas(800, 800);

const data = [
  { year: '1991', value: 3 },
  { year: '1992', value: 4 },
  { year: '1993', value: 3.5 },
  { year: '1994', value: 5 },
  { year: '1995', value: 4.9 },
  { year: '1996', value: 6 },
  { year: '1997', value: 7 },
  { year: '1998', value: 9 },
  { year: '1999', value: 13 }
];
const chart = new G2.Chart({
  el: canvas,
  forceFit: true
});
chart
  .source(data)
  .transform({
    type: 'fold',
    fields: ['gold', 'silver'], // 展开字段集
    key: 'key',                   // key字段
    value: 'value',               // value字段
    retains: ['country']        // 保留字段集，默认为除 fields 以外的所有字段
  });
chart.scale('value', {
  min: 0
});
chart.scale('year', {
  range: [0, 1]
});
chart.tooltip({
  crosshairs: {
    type: 'line'
  }
});
chart.line().position('year*value');
chart.point().position('year*value').size(4).shape('circle').style({
  stroke: '#fff',
  lineWidth: 1
});
chart.render();
console.log(canvas.toBuffer());
fs.writeFileSync("text.png", canvas.toBuffer());
