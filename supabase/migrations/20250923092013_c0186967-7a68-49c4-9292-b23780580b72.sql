-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES 
('Fiction', 'Novels, short stories, and other fictional works'),
('Non-Fiction', 'Biographies, history, self-help, and factual books'),
('Science Fiction', 'Futuristic and speculative fiction'),
('Mystery', 'Detective stories and crime novels'),
('Romance', 'Love stories and romantic fiction'),
('Fantasy', 'Magical and fantastical stories'),
('Biography', 'Life stories of real people'),
('History', 'Historical accounts and documentation'),
('Science', 'Scientific research and discoveries'),
('Technology', 'Computing, engineering, and technical books');

-- Insert sample authors
INSERT INTO public.authors (first_name, last_name, biography, nationality, birth_date) VALUES 
('Jane', 'Austen', 'English novelist known for her social commentary and wit', 'British', '1775-12-16'),
('George', 'Orwell', 'English author known for dystopian fiction', 'British', '1903-06-25'),
('Agatha', 'Christie', 'British crime novelist and playwright', 'British', '1890-09-15'),
('Isaac', 'Asimov', 'American science fiction writer and biochemist', 'American', '1920-01-02'),
('Stephen', 'King', 'American author known for horror and supernatural fiction', 'American', '1947-09-21'),
('J.K.', 'Rowling', 'British author of the Harry Potter series', 'British', '1965-07-31'),
('Ernest', 'Hemingway', 'American novelist and journalist', 'American', '1899-07-21'),
('Virginia', 'Woolf', 'English writer and modernist author', 'British', '1882-01-25'),
('Mark', 'Twain', 'American writer and humorist', 'American', '1835-11-30'),
('Charles', 'Dickens', 'English writer and social critic', 'British', '1812-02-07');

-- Insert sample publishers
INSERT INTO public.publishers (name, address, contact_email, contact_phone, website) VALUES 
('Penguin Random House', '1745 Broadway, New York, NY 10019', 'info@penguinrandomhouse.com', '+1-212-782-9000', 'https://www.penguinrandomhouse.com'),
('HarperCollins', '195 Broadway, New York, NY 10007', 'info@harpercollins.com', '+1-212-207-7000', 'https://www.harpercollins.com'),
('Simon & Schuster', '1230 Avenue of the Americas, New York, NY 10020', 'info@simonandschuster.com', '+1-212-698-7000', 'https://www.simonandschuster.com'),
('Macmillan Publishers', '120 Broadway, New York, NY 10271', 'info@macmillan.com', '+1-646-307-5151', 'https://us.macmillan.com'),
('Hachette Book Group', '1290 Avenue of the Americas, New York, NY 10104', 'info@hachettebookgroup.com', '+1-212-364-1100', 'https://www.hachettebookgroup.com'),
('Scholastic Corporation', '557 Broadway, New York, NY 10012', 'info@scholastic.com', '+1-212-343-6100', 'https://www.scholastic.com'),
('Oxford University Press', '198 Madison Avenue, New York, NY 10016', 'info@oup.com', '+1-212-726-6000', 'https://global.oup.com'),
('Cambridge University Press', '1 Liberty Plaza, New York, NY 10006', 'info@cambridge.org', '+1-212-924-3900', 'https://www.cambridge.org'),
('Wiley', '111 River Street, Hoboken, NJ 07030', 'info@wiley.com', '+1-201-748-6000', 'https://www.wiley.com'),
('Pearson Education', '221 River Street, Hoboken, NJ 07030', 'info@pearson.com', '+1-201-236-7000', 'https://www.pearson.com');

-- Insert sample books
INSERT INTO public.books (call_number, title, author, publisher, genre, total_copies, available_copies, isbn, publication_year, description, category_id, publisher_id) 
SELECT 
  'FICT-001', 'Pride and Prejudice', 'Jane Austen', 'Penguin Random House', 'Fiction', 3, 2, '978-0141439518', 1813, 
  'A romantic novel of manners written by Jane Austen in 1813.',
  c.id, p.id
FROM categories c, publishers p 
WHERE c.name = 'Fiction' AND p.name = 'Penguin Random House'
UNION ALL
SELECT 
  'FICT-002', '1984', 'George Orwell', 'Penguin Random House', 'Science Fiction', 5, 4, '978-0451524935', 1949,
  'A dystopian social science fiction novel and cautionary tale.',
  c.id, p.id
FROM categories c, publishers p 
WHERE c.name = 'Science Fiction' AND p.name = 'Penguin Random House'
UNION ALL
SELECT 
  'MYST-001', 'Murder on the Orient Express', 'Agatha Christie', 'HarperCollins', 'Mystery', 2, 1, '978-0062693662', 1934,
  'A detective novel featuring Hercule Poirot.',
  c.id, p.id
FROM categories c, publishers p 
WHERE c.name = 'Mystery' AND p.name = 'HarperCollins'
UNION ALL
SELECT 
  'SCIF-001', 'Foundation', 'Isaac Asimov', 'Simon & Schuster', 'Science Fiction', 4, 3, '978-0553293357', 1951,
  'The first novel in the Foundation series by Isaac Asimov.',
  c.id, p.id
FROM categories c, publishers p 
WHERE c.name = 'Science Fiction' AND p.name = 'Simon & Schuster'
UNION ALL
SELECT 
  'HORR-001', 'The Shining', 'Stephen King', 'Macmillan Publishers', 'Horror', 3, 2, '978-0307743657', 1977,
  'A horror novel about a family isolated in a haunted hotel.',
  c.id, p.id
FROM categories c, publishers p 
WHERE c.name = 'Fiction' AND p.name = 'Macmillan Publishers'
UNION ALL
SELECT 
  'FANT-001', 'Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', 'Scholastic Corporation', 'Fantasy', 6, 5, '978-0439708180', 1997,
  'The first novel in the Harry Potter series.',
  c.id, p.id
FROM categories c, publishers p 
WHERE c.name = 'Fantasy' AND p.name = 'Scholastic Corporation'
UNION ALL
SELECT 
  'FICT-003', 'The Old Man and the Sea', 'Ernest Hemingway', 'Hachette Book Group', 'Fiction', 2, 2, '978-0684801223', 1952,
  'A short novel about an aging Cuban fisherman.',
  c.id, p.id
FROM categories c, publishers p 
WHERE c.name = 'Fiction' AND p.name = 'Hachette Book Group'
UNION ALL
SELECT 
  'FICT-004', 'To the Lighthouse', 'Virginia Woolf', 'Oxford University Press', 'Fiction', 2, 1, '978-0199536610', 1927,
  'A modernist novel exploring the complexities of human relationships.',
  c.id, p.id
FROM categories c, publishers p 
WHERE c.name = 'Fiction' AND p.name = 'Oxford University Press'
UNION ALL
SELECT 
  'FICT-005', 'The Adventures of Tom Sawyer', 'Mark Twain', 'Cambridge University Press', 'Fiction', 3, 3, '978-0521567553', 1876,
  'A novel about a young boy growing up along the Mississippi River.',
  c.id, p.id
FROM categories c, publishers p 
WHERE c.name = 'Fiction' AND p.name = 'Cambridge University Press'
UNION ALL
SELECT 
  'FICT-006', 'Great Expectations', 'Charles Dickens', 'Wiley', 'Fiction', 4, 2, '978-0141439563', 1861,
  'A bildungsroman that depicts the personal growth of an orphan named Pip.',
  c.id, p.id
FROM categories c, publishers p 
WHERE c.name = 'Fiction' AND p.name = 'Wiley';

-- Insert book-author relationships
INSERT INTO public.book_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b, authors a
WHERE (b.author = 'Jane Austen' AND a.last_name = 'Austen')
   OR (b.author = 'George Orwell' AND a.last_name = 'Orwell')
   OR (b.author = 'Agatha Christie' AND a.last_name = 'Christie')
   OR (b.author = 'Isaac Asimov' AND a.last_name = 'Asimov')
   OR (b.author = 'Stephen King' AND a.last_name = 'King')
   OR (b.author = 'J.K. Rowling' AND a.last_name = 'Rowling')
   OR (b.author = 'Ernest Hemingway' AND a.last_name = 'Hemingway')
   OR (b.author = 'Virginia Woolf' AND a.last_name = 'Woolf')
   OR (b.author = 'Mark Twain' AND a.last_name = 'Twain')
   OR (b.author = 'Charles Dickens' AND a.last_name = 'Dickens');

-- Insert book copies for each book
INSERT INTO public.book_copies (book_id, copy_number, condition, location, is_available)
SELECT 
  b.id,
  'COPY-' || b.call_number || '-' || generate_series(1, b.total_copies),
  CASE 
    WHEN random() < 0.7 THEN 'good'
    WHEN random() < 0.9 THEN 'fair'
    ELSE 'excellent'
  END,
  CASE 
    WHEN random() < 0.5 THEN 'Main Floor - Section A'
    WHEN random() < 0.8 THEN 'Second Floor - Section B'
    ELSE 'Basement Archives'
  END,
  generate_series(1, b.total_copies) <= b.available_copies
FROM books b;

-- Insert some library settings
INSERT INTO public.library_settings (setting_key, setting_value, description, category, is_public) VALUES 
('max_borrow_days', '14', 'Maximum number of days a book can be borrowed', 'borrowing', true),
('max_renewals', '2', 'Maximum number of times a book can be renewed', 'borrowing', true),
('fine_per_day', '0.50', 'Fine amount per day for overdue books', 'fines', true),
('max_books_per_user', '5', 'Maximum number of books a user can borrow at once', 'borrowing', true),
('library_name', 'University Central Library', 'Official name of the library', 'general', true),
('library_address', '123 University Ave, Education City', 'Physical address of the library', 'general', true),
('library_phone', '+1-555-0123', 'Contact phone number', 'general', true),
('library_email', 'info@universitylibrary.edu', 'Contact email address', 'general', true),
('operating_hours_weekday', '8:00 AM - 10:00 PM', 'Library hours Monday to Friday', 'general', true),
('operating_hours_weekend', '10:00 AM - 6:00 PM', 'Library hours Saturday and Sunday', 'general', true);