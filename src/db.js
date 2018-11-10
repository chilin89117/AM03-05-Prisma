const users = [
  {id: '123abc', name: 'Abbie', email: 'abbie@example.com', age: 27},
  {id: '789xyz', name: 'Paulina', email: 'paulina@example.com', age: 28},
  {id: '456mno', name: 'Maria', email: 'maria@example.com'}
];

const posts = [
  {id: '1', title: 'GraphQL 101', body: 'How to use GraphQL ...', published: true, author: '123abc'},
  {id: '2', title: 'GraphQL 201', body: 'Advanced GraphQL ...', published: false, author: '123abc'},
  {id: '3', title: 'MongoDB 101', body: 'NoSQL database ...', published: false, author: '789xyz'},
  {id: '4', title: 'MongoDB 201', body: 'JavaScript ...', published: true, author: '456mno'}
];

const comments = [
  {id: 'c1', text: 'text of comment 1', author: '456mno', post: '1'},
  {id: 'c2', text: 'text of comment 2', author: '456mno', post: '2'},
  {id: 'c3', text: 'text of comment 3', author: '456mno', post: '3'},
  {id: 'c4', text: 'text of comment 4', author: '789xyz', post: '3'},
  {id: 'c5', text: 'text of comment 5', author: '789xyz', post: '3'},
  {id: 'c6', text: 'text of comment 6', author: '123abc', post: '4'},
];

const db = {users, posts, comments};
export {db as default};
