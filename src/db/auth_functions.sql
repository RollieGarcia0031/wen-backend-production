ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users are viewable by everyone."
  ON public.users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own user profile."
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own user profile."
  ON public.users FOR UPDATE
  USING (auth.uid() = id);


-- trigger function upon user signup

CREATE OR REPLACE FUNCTION public.signup_handler()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, role, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'role',
    NEW.email
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- attach the trigger function upon signup

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.signup_handler();

-- update users table upon users table update

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();