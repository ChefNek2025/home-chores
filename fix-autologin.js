const fs = require('fs');

// Fix login page - add auto-redirect if already logged in
let login = fs.readFileSync('pages/login.tsx', 'utf8');

login = login.replace(
  "import { useState } from 'react';",
  "import { useState, useEffect } from 'react';"
);

login = login.replace(
  'const router = useRouter();',
  `const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
    });
  }, []);`
);

fs.writeFileSync('pages/login.tsx', login);
console.log('login fixed! useEffect:', login.indexOf('useEffect'));

// Fix landing page - add auto-redirect if already logged in
let index = fs.readFileSync('pages/index.tsx', 'utf8');

// Check if supabase is imported
if (!index.includes("from '../lib/supabase'") && !index.includes('from "../lib/supabase"')) {
  index = index.replace(
    "import React",
    "import { supabase } from '../lib/supabase';\nimport React"
  );
}

// Add auto-redirect useEffect after router declaration
if (!index.includes('getSession')) {
  index = index.replace(
    'const router = useRouter();',
    `const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard');
    });
  }, []);`
  );
}

fs.writeFileSync('pages/index.tsx', index);
console.log('index fixed! getSession:', index.indexOf('getSession'));