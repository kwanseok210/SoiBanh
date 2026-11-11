CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.dish_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  sample_result_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.dish_history TO authenticated;
GRANT ALL ON public.dish_history TO service_role;
ALTER TABLE public.dish_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own dish history" ON public.dish_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their own dish history" ON public.dish_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own dish history" ON public.dish_history FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX dish_history_user_created_at_idx ON public.dish_history (user_id, created_at DESC);

CREATE TABLE public.migration_source_users (
  source_user_id uuid PRIMARY KEY,
  source_email text NOT NULL,
  email_normalized text GENERATED ALWAYS AS (lower(btrim(source_email))) STORED,
  display_name text NOT NULL DEFAULT '',
  linked_auth_user_id uuid UNIQUE,
  linked_at timestamptz
);
GRANT ALL ON public.migration_source_users TO service_role;
ALTER TABLE public.migration_source_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No client access to imported source users" ON public.migration_source_users FOR ALL TO public USING (false) WITH CHECK (false);
CREATE INDEX migration_source_users_email_normalized_idx ON public.migration_source_users (email_normalized);

CREATE OR REPLACE FUNCTION public.claim_imported_profile(_auth_user_id uuid, _verified_email text)
RETURNS text
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matching_rows bigint;
  source_account public.migration_source_users%ROWTYPE;
BEGIN
  IF _auth_user_id IS NULL OR _verified_email IS NULL OR btrim(_verified_email) = '' THEN
    RETURN NULL;
  END IF;
  PERFORM pg_advisory_xact_lock(hashtextextended(lower(btrim(_verified_email)), 0));
  SELECT count(*) INTO matching_rows
  FROM public.migration_source_users
  WHERE email_normalized = lower(btrim(_verified_email));
  IF matching_rows <> 1 THEN
    RETURN NULL;
  END IF;
  SELECT * INTO source_account
  FROM public.migration_source_users
  WHERE email_normalized = lower(btrim(_verified_email))
  FOR UPDATE;
  IF source_account.linked_auth_user_id IS NOT NULL
     AND source_account.linked_auth_user_id <> _auth_user_id THEN
    RETURN NULL;
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.migration_source_users
    WHERE linked_auth_user_id = _auth_user_id
      AND source_user_id <> source_account.source_user_id
  ) THEN
    RETURN NULL;
  END IF;
  UPDATE public.migration_source_users
  SET linked_auth_user_id = _auth_user_id,
      linked_at = COALESCE(linked_at, now())
  WHERE source_user_id = source_account.source_user_id;
  UPDATE public.dish_history
  SET user_id = _auth_user_id
  WHERE user_id = source_account.source_user_id;
  INSERT INTO public.profiles (id, display_name)
  VALUES (_auth_user_id, source_account.display_name)
  ON CONFLICT (id) DO UPDATE
  SET display_name = CASE
    WHEN btrim(EXCLUDED.display_name) <> '' THEN EXCLUDED.display_name
    ELSE public.profiles.display_name
  END,
  updated_at = now();
  RETURN source_account.display_name;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_imported_profile(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_imported_profile(uuid, text) TO service_role;