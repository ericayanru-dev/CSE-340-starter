-- Ex1 Insert new record to account table
INSERT INTO public.account(
account_firstname,
account_lastname,
account_email,
account_password
)
VALUES (
'Tony',
'Stark',
'tony@starkent.com',
'Iam1ronM@m'
);

-- Ex2 Modify account_type to 'Admin'
UPDATE public.account 
SET account_type ='Admin' 
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark'

-- Ex3 Delete record from account
DELETE FROM public.account 
WHERE account_firstname = 'Tony' AND account_lastname = 'Stark';

-- Ex4 Modify part of text
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Ex5 Using inner joint to select from two tables
SELECT inv_make, inv_model, classification_name
FROM public.inventory I
JOIN public.classification C
ON I.classification_id = C.classification_id
WHERE I.classification_id = 2

-- Ex6 update part Text for all records
UPDATE public.inventory
SET inv_image = REPLACE(inv_image,'/images/', '/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
