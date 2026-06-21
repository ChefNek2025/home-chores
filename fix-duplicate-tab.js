const fs = require('fs');
let code = fs.readFileSync('pages/dashboard.tsx', 'utf8');
const tabText = "{id:'photos',label:'📸 Photos'}";
const first = code.indexOf(tabText);
const second = code.indexOf(tabText, first + 1);
if (second > -1) {
  code = code.substring(0, second - 1) + code.substring(second + tabText.length);
  console.log('removed duplicate tab!');
}
fs.writeFileSync('pages/dashboard.tsx', code);
console.log('tabs now:', (code.match(/📸 Photos/g) || []).length);