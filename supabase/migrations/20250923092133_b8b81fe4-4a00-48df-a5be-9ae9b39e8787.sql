-- Insert additional sample books (avoiding duplicates)
INSERT INTO public.books (call_number, title, author, publisher, genre, total_copies, available_copies, isbn, publication_year, description) 
VALUES 
  ('TECH-001', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 'Technology', 3, 3, '978-0132350884', 2008, 'A handbook of agile software craftsmanship'),
  ('TECH-002', 'The Pragmatic Programmer', 'David Thomas', 'Addison-Wesley', 'Technology', 2, 1, '978-0201616224', 1999, 'From journeyman to master programmer'),
  ('HIST-001', 'Sapiens', 'Yuval Noah Harari', 'Harper', 'History', 4, 2, '978-0062316097', 2014, 'A brief history of humankind'),
  ('BIOG-001', 'Steve Jobs', 'Walter Isaacson', 'Simon & Schuster', 'Biography', 2, 2, '978-1451648539', 2011, 'The exclusive biography of Steve Jobs'),
  ('SCIF-002', 'Dune', 'Frank Herbert', 'Ace Books', 'Science Fiction', 5, 3, '978-0441172719', 1965, 'Epic science fiction novel set on the desert planet Arrakis'),
  ('ROM-001', 'The Notebook', 'Nicholas Sparks', 'Warner Books', 'Romance', 3, 2, '978-0446676090', 1996, 'A love story that spans decades'),
  ('MYST-002', 'The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Vintage Crime', 'Mystery', 2, 1, '978-0307949486', 2005, 'A gripping thriller from Sweden'),
  ('FANT-002', 'The Hobbit', 'J.R.R. Tolkien', 'Houghton Mifflin', 'Fantasy', 4, 4, '978-0547928227', 1937, 'A classic fantasy adventure story'),
  ('NONF-001', 'Atomic Habits', 'James Clear', 'Avery', 'Self-Help', 5, 4, '978-0735211292', 2018, 'An easy and proven way to build good habits'),
  ('NONF-002', 'Educated', 'Tara Westover', 'Random House', 'Memoir', 3, 2, '978-0399590504', 2018, 'A powerful memoir about education and family')
ON CONFLICT (call_number) DO NOTHING;

-- Insert some sample notifications (these would typically be created by the system)
INSERT INTO public.notifications (user_id, title, message, type, action_url) 
SELECT 
  p.user_id,
  'Welcome to Library Pro!',
  'Your account has been successfully created. Start exploring our book collection.',
  'info',
  '/app/catalog'
FROM profiles p 
WHERE NOT EXISTS (
  SELECT 1 FROM notifications n WHERE n.user_id = p.user_id
)
LIMIT 5;

-- Insert some sample issued books (for demonstration)
INSERT INTO public.issued_books (user_id, book_id, issue_date, due_date, status)
SELECT 
  p.user_id,
  b.id,
  CURRENT_DATE - INTERVAL '5 days',
  CURRENT_DATE + INTERVAL '9 days',
  'issued'
FROM profiles p 
CROSS JOIN books b
WHERE p.role = 'student'
  AND b.available_copies > 0
  AND NOT EXISTS (
    SELECT 1 FROM issued_books ib 
    WHERE ib.user_id = p.user_id AND ib.book_id = b.id
  )
LIMIT 3;

-- Update available copies for issued books
UPDATE books 
SET available_copies = available_copies - (
  SELECT COUNT(*) 
  FROM issued_books ib 
  WHERE ib.book_id = books.id 
    AND ib.status = 'issued'
)
WHERE id IN (
  SELECT DISTINCT book_id 
  FROM issued_books 
  WHERE status = 'issued'
);

-- Insert some sample fines
INSERT INTO public.fines (user_id, amount, reason, status, due_date, issued_book_id)
SELECT 
  ib.user_id,
  5.50,
  'Overdue book fine',
  'pending',
  CURRENT_DATE + INTERVAL '30 days',
  ib.id
FROM issued_books ib
WHERE ib.due_date < CURRENT_DATE
  AND NOT EXISTS (
    SELECT 1 FROM fines f WHERE f.issued_book_id = ib.id
  )
LIMIT 2;