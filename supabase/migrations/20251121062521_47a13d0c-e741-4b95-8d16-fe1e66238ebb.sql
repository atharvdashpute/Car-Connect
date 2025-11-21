-- Fix security issue: Restrict profiles table access
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can view profiles of sellers they interact with"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cars WHERE seller_id = profiles.id AND status = 'approved'
  )
  OR EXISTS (
    SELECT 1 FROM bookings WHERE buyer_id = auth.uid() 
    AND car_id IN (SELECT id FROM cars WHERE seller_id = profiles.id)
  )
);

-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for car images storage
CREATE POLICY "Car images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'car-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own car images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'car-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own car images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'car-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add payment-related columns to bookings table if not exists
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_order_id text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_payment_id text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_signature text;

-- Enable realtime for chat functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;