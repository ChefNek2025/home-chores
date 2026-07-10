const fs = require('fs');
let code = fs.readFileSync('pages/index.tsx', 'utf8');

// Fix 1: Change the language sentence
code = code.replace(
  'Whether you speak Amharic, Arabic, English, or Spanish — every family deserves a simple way to manage chores and pay their kids fairly.',
  'Built for Ethiopian families and every family worldwide. Simple, fair, and works on any phone! 🌍🇪🇹'
);

// Fix 2: Fix the age question
code = code.replace(
  'Best for kids ages 8–17 who are old enough to use a phone.',
  'Best for kids ages 6–17. Any kid old enough to do chores can use it!'
);

// Fix 3: Fix the kids number question
code = code.replace(
  'The free version supports up to 4 kids. The Business plan supports unlimited family members.',
  'One $4.99/month plan supports unlimited kids for your whole family! No limits.'
);

fs.writeFileSync('pages/index.tsx', code);
console.log('done! language:', code.indexOf('Built for Ethiopian'));