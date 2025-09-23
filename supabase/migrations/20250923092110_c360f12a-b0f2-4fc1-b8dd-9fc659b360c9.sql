-- Insert additional sample data (avoid duplicates)

-- Insert sample books (checking for existing titles first)
INSERT INTO public.books (call_number, title, author, publisher, genre, total_copies, available_copies, isbn, publication_year, description) 
SELECT * FROM (VALUES 
  ('FICT-007', 'Jane Eyre', 'Charlotte Bronte', 'Penguin Classics', 'Fiction', 3, 2, '978-0141441146', 1847, 'A coming-of-age story following the emotions and experiences of its eponymous heroine.'),
  ('FICT-008', 'Wuthering Heights', 'Emily Bronte', 'Penguin Classics', 'Fiction', 2, 1, '978-0141439556', 1847, 'A tale of passion and revenge on the Yorkshire moors.'),
  ('SCIF-002', 'Dune', 'Frank Herbert', 'Ace Books', 'Science Fiction', 4, 3, '978-0441013593', 1965, 'Epic science fiction novel set in a distant future.'),
  ('FANT-002', 'The Lord of the Rings', 'J.R.R. Tolkien', 'Houghton Mifflin', 'Fantasy', 5, 4, '978-0544003415', 1954, 'Epic high fantasy adventure in Middle-earth.'),
  ('BIOG-001', 'Steve Jobs', 'Walter Isaacson', 'Simon & Schuster', 'Biography', 2, 2, '978-1451648539', 2011, 'Biography of the Apple co-founder and tech visionary.'),
  ('HIST-001', 'Sapiens', 'Yuval Noah Harari', 'Harper', 'History', 3, 2, '978-0062316097', 2014, 'A brief history of humankind from the Stone Age to the present.'),
  ('TECH-001', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 'Technology', 2, 1, '978-0132350884', 2008, 'A handbook of agile software craftsmanship.'),
  ('ROM-001', 'The Notebook', 'Nicholas Sparks', 'Warner Books', 'Romance', 2, 2, '978-0446676090', 1996, 'A romantic novel about enduring love.'),
  ('MYST-002', 'The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Vintage', 'Mystery', 3, 2, '978-0307454546', 2005, 'Swedish crime thriller featuring hacker Lisbeth Salander.')
) AS new_books(call_number, title, author, publisher, genre, total_copies, available_copies, isbn, publication_year, description)
WHERE NOT EXISTS (
  SELECT 1 FROM public.books WHERE title = new_books.title
);

-- Insert sample notifications for testing
INSERT INTO public.notifications (user_id, title, message, type, action_url)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid,
  'Welcome to Library Pro!',
  'Your account has been successfully created. Start browsing our extensive book collection.',
  'info',
  '/app/catalog'
WHERE NOT EXISTS (SELECT 1 FROM public.notifications WHERE title = 'Welcome to Library Pro!');