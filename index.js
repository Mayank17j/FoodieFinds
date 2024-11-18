const express = require('express');
const { resolve } = require('path');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
const port = 3000;
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

//Table Name: restaurants
//Table Attributes: name, cuisine, isVeg, rating, priceForTwo, location, hasOutdoorSeating, isLuxury

/*
Exercise 1: Get All Restaurants
Example Call: http://localhost:3000/restaurants
*/
async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllRestaurants();
    if (result.restaurants.length === 0)
      return res.status(404).json({ message: 'No restaurants found!' });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 2: Get Restaurant by ID
Query Parameters: id (integer)
Example Call: http://localhost:3000/restaurants/details/1
*/
async function fetchRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id=?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await fetchRestaurantById(id);
    if (result.restaurants.length === 0)
      return res
        .status(404)
        .json({ message: 'No restaurant found of id: ' + id });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 3: Get Restaurants by Cuisine
Query Parameters: cuisine (string)
Example Call:http://localhost:3000/restaurants/cuisine/Indian
*/
async function fetchRestaurantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine=?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await fetchRestaurantByCuisine(cuisine);
    if (result.restaurants.length === 0)
      return res
        .status(404)
        .json({ message: 'No restaurant found having cuisine: ' + cuisine });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 4: Get Restaurants by Filter. Fetch restaurants based on filters such as veg/non-veg, outdoor seating, luxury, etc.
Query Parameters: isVeg (string), hasOutdoorSeating (string), isLuxury (string)
Tasks: Implement a function to fetch restaurants by these filters.
Example Call: http://localhost:3000/restaurants/filter?isVeg=true&hasOutdoorSeating=true&isLuxury=false
*/
async function fetchRestaurantsByFilter(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg=? AND hasOutdoorSeating=? AND isLuxury=?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let result = await fetchRestaurantsByFilter(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (result.restaurants.length === 0)
      return res.status(404).json({
        message:
          'No restaurant found with isVeg: ' +
          isVeg +
          ', hasOutdoorSeating: ' +
          hasOutdoorSeating +
          ' isLuxury: ' +
          isLuxury +
          '!',
      });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 5: Get Restaurants Sorted by Rating
Example Call: http://localhost:3000/restaurants/sort-by-rating
*/
async function fetchRestaurantSortByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await fetchRestaurantSortByRating();
    if (result.restaurants.length === 0)
      return res.status(404).json({ message: 'No restaurant found!' });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 6: Get All Dishes
Example Call: http://localhost:3000/dishes
*/
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await fetchAllDishes();
    if (result.dishes.length === 0)
      return res.status(404).json({ message: 'No dishes found!' });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 7: Get Dish by ID
Example Call: http://localhost:3000/dishes/details/1
*/
async function fetchDisheById(id) {
  let query = 'SELECT * FROM dishes WHERE id=?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await fetchDisheById(id);
    if (result.dishes.length === 0)
      return res.status(404).json({ message: 'No dish found of id: ' + id });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 8: Get Dishes by Filter. Fetch dishes based on filters such as veg/non-veg.
Example Call: http://localhost:3000/dishes/filter?isVeg=true
*/
async function fetchDisheByVegNonveg(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg=?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let result = await fetchDisheByVegNonveg(isVeg);
    if (result.dishes.length === 0)
      return res
        .status(404)
        .json({ message: 'No dish found by isVeg: ' + isVeg });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/*
Exercise 9: Get Dishes Sorted by Price
Example Call: http://localhost:3000/dishes/sort-by-price
*/
async function fetchDisheSortByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await fetchDisheSortByPrice();
    if (result.dishes.length === 0)
      return res.status(404).json({ message: 'No dish found!' });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
