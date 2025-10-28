-- Fix search_path for functions to pass security linter

-- Update can_renew_book function
CREATE OR REPLACE FUNCTION can_renew_book(issued_book_id uuid)
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  book_record record;
BEGIN
  SELECT * INTO book_record FROM issued_books WHERE id = issued_book_id;
  
  IF book_record.status != 'issued' THEN
    RETURN false;
  END IF;
  
  IF book_record.renewal_count >= book_record.max_renewals THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Update renew_book function
CREATE OR REPLACE FUNCTION renew_book(issued_book_id uuid, renewal_days integer DEFAULT 14)
RETURNS json 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  book_record record;
  new_due_date timestamp with time zone;
  result json;
BEGIN
  IF NOT can_renew_book(issued_book_id) THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Book cannot be renewed. Maximum renewals reached or book is not currently issued.'
    );
  END IF;
  
  SELECT * INTO book_record FROM issued_books WHERE id = issued_book_id;
  new_due_date := GREATEST(book_record.due_date, now()) + (renewal_days || ' days')::interval;
  
  UPDATE issued_books
  SET 
    due_date = new_due_date,
    renewal_count = renewal_count + 1,
    updated_at = now()
  WHERE id = issued_book_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Book renewed successfully',
    'new_due_date', new_due_date,
    'renewals_remaining', book_record.max_renewals - book_record.renewal_count - 1
  );
END;
$$;

-- Update reading goals trigger function
CREATE OR REPLACE FUNCTION update_reading_goals()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'returned' AND OLD.status != 'returned' THEN
    UPDATE reading_goals
    SET 
      current_value = current_value + 1,
      updated_at = now()
    WHERE 
      user_id = NEW.user_id 
      AND goal_type = 'books_per_month'
      AND status = 'active'
      AND start_date <= CURRENT_DATE
      AND end_date >= CURRENT_DATE;
  END IF;
  
  RETURN NEW;
END;
$$;