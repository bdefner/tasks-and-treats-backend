-- This file contains only my notes on developing the project,
-- changing this file doesn't change anything in
-- the database

-- Create users table

CREATE TABLE users(
  user_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username varchar(70) NOT NULL UNIQUE,
  password_hash varchar (100) NOT NULL UNIQUE
);

INSERT INTO users
  (username, password_hash)
VALUES
  ('Beppino', 'dsh78932z4iughf32987zrwer342'),
  ('Franzi', 'dsh78932z4iutzrtzrtzhfghft');

SELECT * FROM users;

-- Create groups table
CREATE TABLE groups(
  group_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  share_token varchar(90) NOT NULL,
  user_a_id int NOT NULL,
  user_b_id int NOT NULL
);

INSERT INTO groups
  (share_token, user_a_id, user_b_id)
VALUES
  ('123456789', 1, 2);

SELECT * FROM groups;

-- Create types table
CREATE TABLE types(
  type_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  label varchar(20) NOT NULL
);

INSERT INTO types
  (label)
VALUES
  ('task'),
  ('treat');

SELECT * from types;

-- Create status table
CREATE TABLE status(
  status_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  label varchar(20) NOT NULL
);

INSERT INTO status
  (label)
VALUES
  ('private'),
  ('pending'),
  ('accepted'),
  ('in process'),
  ('done');

SELECT * FROM status;

-- Create carts table
CREATE TABLE carts(
  cart_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer NOT NULL,
  time_of_creation DATE NOT NULL,
  type_id int NOT NULL,
  label varchar(140) NOT NULL,
  rating int NOT NULL,
  due_date DATE,
  status_id int NOT NULL,
  assigned_to_user_id int,
  received_from_user_id int,
  group_id int
);

-- Create personal carts

INSERT INTO carts
  (user_id, time_of_creation, type_id, label, rating, status_id)
VALUES
 (1, '2022-10-31', 1, 'This is the first personal Task', 8, 1),
 (1, '2022-10-31', 2, 'This is the first personal Treat', 3, 1);

 -- Create shared carts

INSERT INTO carts
  (user_id, time_of_creation, type_id, label, rating, status_id, group_id)
VALUES
 (1, '2022-10-31', 1, 'This is the first shared Task', 5, 3, 1),
 (1, '2022-10-31', 2, 'This is the first shared Treat', 4, 3, 1);

SELECT * FROM carts;
