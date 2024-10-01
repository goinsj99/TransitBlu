CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "full_name" varchar,
  "username" varchar,
  "password" varchar,
  "fav_routes" int [],
  "walking_speed" int
);

CREATE TABLE "routes" (
  "id" SERIAL PRIMARY KEY,
  "departure" varchar,
  "arrival" varchar,
  "time" int,
  "on_time" boolean
);

CREATE TABLE "feedback" (
  "id" SERIAL PRIMARY KEY,
  "user" int,
  "message" varchar,
  "time" time,
  "read" boolean
);

ALTER TABLE "feedback" ADD FOREIGN KEY ("user") REFERENCES "users" ("id");

INSERT INTO users(full_name, username, password) VALUES ('Owen Helfer', 'username', 'password');