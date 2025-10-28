-- Create book favorites table
CREATE TABLE IF NOT EXISTS public.book_favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Enable RLS
ALTER TABLE public.book_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON public.book_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
  ON public.book_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.book_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create book recommendations table
CREATE TABLE IF NOT EXISTS public.book_recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  score numeric NOT NULL DEFAULT 0,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_id)
);

-- Enable RLS
ALTER TABLE public.book_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recommendations
CREATE POLICY "Users can view their own recommendations"
  ON public.book_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage recommendations"
  ON public.book_recommendations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  ));

-- Add renewal fields to issued_books if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'issued_books' AND column_name = 'max_renewals'
  ) THEN
    ALTER TABLE public.issued_books ADD COLUMN max_renewals integer NOT NULL DEFAULT 2;
  END IF;
END $$;

-- Create function to check if book can be renewed
CREATE OR REPLACE FUNCTION can_renew_book(issued_book_id uuid)
RETURNS boolean AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to renew a book
CREATE OR REPLACE FUNCTION renew_book(issued_book_id uuid, renewal_days integer DEFAULT 14)
RETURNS json AS $$
DECLARE
  book_record record;
  new_due_date timestamp with time zone;
  result json;
BEGIN
  -- Check if renewal is allowed
  IF NOT can_renew_book(issued_book_id) THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Book cannot be renewed. Maximum renewals reached or book is not currently issued.'
    );
  END IF;
  
  -- Get current record
  SELECT * INTO book_record FROM issued_books WHERE id = issued_book_id;
  
  -- Calculate new due date
  new_due_date := GREATEST(book_record.due_date, now()) + (renewal_days || ' days')::interval;
  
  -- Update the record
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create reading goals table
CREATE TABLE IF NOT EXISTS public.reading_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type text NOT NULL DEFAULT 'books_per_month',
  target_value integer NOT NULL,
  current_value integer NOT NULL DEFAULT 0,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reading_goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reading goals
CREATE POLICY "Users can manage their own goals"
  ON public.reading_goals FOR ALL
  USING (auth.uid() = user_id);

-- Create trigger to update reading goals
CREATE OR REPLACE FUNCTION update_reading_goals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update monthly goals when a book is returned
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reading_goals_trigger
AFTER UPDATE ON issued_books
FOR EACH ROW
EXECUTE FUNCTION update_reading_goals();