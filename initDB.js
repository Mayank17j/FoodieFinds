const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      cuisine TEXT,
      isVeg TEXT,
      rating REAL,
      priceForTwo INTEGER,
      location TEXT,
      hasOutdoorSeating TEXT,
      isLuxury TEXT
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Restaurants table created or already exists.');
      }
    }
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS dishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      isVeg TEXT,
      rating REAL,
      price INTEGER
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Dishes table created or already exists.');
      }
    }
  );

  const stmt = db.prepare(
    'INSERT INTO restaurants (name, cuisine, isVeg, rating, priceForTwo, location, hasOutdoorSeating, isLuxury) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const stmt2 = db.prepare(
    'INSERT INTO dishes (name, isVeg, rating, price) VALUES (?, ?, ?, ?)'
  );

  const restaurants = [
    {
      name: 'Spice Kitchen',
      cuisine: 'Indian',
      isVeg: 'true',
      rating: 4.5,
      priceForTwo: 1500,
      location: 'MG Road',
      hasOutdoorSeating: 'true',
      isLuxury: 'false',
    },
    {
      name: 'Olive Bistro',
      cuisine: 'Italian',
      isVeg: 'false',
      rating: 4.2,
      priceForTwo: 2000,
      location: 'Jubilee Hills',
      hasOutdoorSeating: 'false',
      isLuxury: 'true',
    },
    {
      name: 'Green Leaf',
      cuisine: 'Chinese',
      isVeg: 'true',
      rating: 4.0,
      priceForTwo: 1000,
      location: 'Banjara Hills',
      hasOutdoorSeating: 'false',
      isLuxury: 'false',
    },
  ];
  const dishes = [
    {
      name: 'Paneer Butter Masala',
      price: 300,
      rating: 4.5,
      isVeg: 'true',
    },
    {
      name: 'Chicken Alfredo Pasta',
      price: 500,
      rating: 4.7,
      isVeg: 'false',
    },
    {
      name: 'Veg Hakka Noodles',
      price: 250,
      rating: 4.3,
      isVeg: 'true',
    },
  ];

  for (let restaurant of restaurants) {
    stmt.run(
      restaurant.name,
      restaurant.cuisine,
      restaurant.isVeg,
      restaurant.rating,
      restaurant.priceForTwo,
      restaurant.location,
      restaurant.hasOutdoorSeating,
      restaurant.isLuxury
    );
  }
  for (let dish of dishes) {
    stmt2.run(dish.name, dish.isVeg, dish.rating, dish.price);
  }

  stmt.finalize();
  stmt2.finalize();

  console.log('Inserted 3 restaurants into the database.');
  console.log('Inserted 3 dishes into the database.');

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});
