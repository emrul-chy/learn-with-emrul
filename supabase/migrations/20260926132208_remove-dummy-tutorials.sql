-- Remove dummy seed tutorials
delete from tutorials
where slug in (
  'getting-started-with-system-design',
  'mastering-react-hooks',
  'typescript-for-backend-engineers'
);
