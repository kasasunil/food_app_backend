const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const RecipeModel = require('./recipeModel');
const UserModel = require('./userModel');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/uploadRecipe', async(req, res) => {
    try{
        // for (let i = 0; i < arr.length; i++) {
        //     console.log(arr[i].imageUrl);
        // const Recipe = await RecipeModel.create(arr[i]);
        // }
        const Recipe = await RecipeModel.create(req.body);
        console.log(Recipe);
        return res.status(200).json({ message: "Recipe uploaded successfully" });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error uploading recipe" });
    }
});

app.put("/api/addReview", async (req, res) => {
    const {recipe, review} = req.body;
    const post = await RecipeModel.findOneAndUpdate({name: recipe}, {$push: {reviews: review}});
    console.log(post);
    return res.status(200).json({ message: "Review added successfully" });
});

app.post("/api/addUser", async (req, res) => {
    const {name, email} = req.body;
    const user = await UserModel.create({name, email});
    console.log(user);
    return res.status(200).json({ message: "User added successfully" });
});

app.get("/api/allRecipes", async (req, res) => {
    const recipes = await RecipeModel.find();
    console.log(recipes);
    return res.status(200).json(recipes);
});

app.post("/api/addToCart", async (req, res) => {
    const {recipe, email} = req.body;
    const post = await UserModel.findOneAndUpdate(
      { email: email },
      { $push: { cartItems: recipe } },
      { new: true ,upsert: true ,runValidators: true ,findAndModify: false }
    );
    console.log(post);
    return res.status(200).json({ message: "User added successfully" });
})

app.post("/api/addToFavorite", async (req, res) => {
    const {recipe, email} = req.body;
    const post = await UserModel.findOneAndUpdate(
      { email: email },
      { $push: { favoriteItems: recipe } },
      { new: true ,upsert: true ,runValidators: true ,findAndModify: false }
    );
    console.log(post);
    return res.status(200).json({ message: "User added successfully" });
})

app.get("/api/getCartItems/:email", async (req, res) => {
    const email=req.params.email;
    const user = await UserModel.findOne({email: email});
    const cartItems = user.cartItems;
    const arr=[];
    for (let i = 0; i < cartItems.length; i++) {
        const recipe = await RecipeModel.findOne({name: cartItems[i]});
        arr.push(recipe);
    }
    return res.status(200).json(arr);
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    mongoose.connect(
      "mongodb+srv://Sunil:sunil@atlascluster.tvkddrz.mongodb.net/test",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('Connected to MongoDB');
    });
});

