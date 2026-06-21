const fs = require('fs');
let code = fs.readFileSync('pages/dashboard.tsx', 'utf8');
const importLine = "import { supabase } from '../lib/supabase';";
const first = code.indexOf(importLine);
const second = code.indexOf(importLine, first + 1);
if (second > -1) {
  code = code.substring(0, second) + code.substring(second + importLine.length + 1);
  console.log('removed duplicate!');
} else {
  console.log('no duplicate found');
}
fs.writeFileSync('pages/dashboard.tsx', code);
console.log('imports now:', (code.match(/import { supabase }/g) || []).length);