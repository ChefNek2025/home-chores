export type KidId = 'liam' | 'sofia';
export type FreqType = 'daily' | '3x daily' | 'weekly';

export interface Chore {
  id: string;
  name: string;
  kid: KidId | 'both';
  payPerCompletion: number;
  freq: FreqType;
  emoji: string;
}

export interface CheckEntry { [key: string]: boolean; }

export interface Payment {
  id: string;
  kid: KidId;
  amount: number;
  date: string;
  note?: string;
}

export interface AppState {
  chores: Chore[];
  checks: CheckEntry;
  payments: Payment[];
  nextId: number;
}

export const DEFAULT_CHORES: Chore[] = [
  { id:'1', name:'Clean the house',          kid:'both', payPerCompletion:5.00, freq:'weekly', emoji:'🧹' },
  { id:'2', name:'Wash dishes',              kid:'both', payPerCompletion:2.00, freq:'daily',  emoji:'🍽️' },
  { id:'3', name:'Make all beds',            kid:'both', payPerCompletion:2.00, freq:'daily',  emoji:'🛏️' },
  { id:'4', name:'Take out trash',           kid:'both', payPerCompletion:1.50, freq:'daily',  emoji:'🗑️' },
  { id:'5', name:'Walk the dog (morning)',   kid:'both', payPerCompletion:2.00, freq:'daily',  emoji:'🐕' },
  { id:'6', name:'Walk the dog (afternoon)', kid:'both', payPerCompletion:2.00, freq:'daily',  emoji:'🐕' },
  { id:'7', name:'Walk the dog (evening)',   kid:'both', payPerCompletion:2.00, freq:'daily',  emoji:'🐕' },
];

export const KIDS = [
  { id: 'liam'  as KidId, name:'Liam',  age:15, color:'text-teal-800', bg:'bg-teal-100' },
  { id: 'sofia' as KidId, name:'Sofia', age:14, color:'text-pink-800', bg:'bg-pink-100' },
];

export const CHORE_SUGGESTIONS = [
  { name:'Clean the house',          emoji:'🧹' },
  { name:'Wash dishes',              emoji:'🍽️' },
  { name:'Make all beds',            emoji:'🛏️' },
  { name:'Take out trash',           emoji:'🗑️' },
  { name:'Walk the dog (morning)',   emoji:'🐕' },
  { name:'Walk the dog (afternoon)', emoji:'🐕' },
  { name:'Walk the dog (evening)',   emoji:'🐕' },
  { name:'Vacuum floors',            emoji:'🌀' },
  { name:'Clean bathroom',           emoji:'🚿' },
  { name:'Do laundry',               emoji:'👕' },
  { name:'Mow the lawn',             emoji:'🌿' },
  { name:'Feed the pet',             emoji:'🐾' },
];