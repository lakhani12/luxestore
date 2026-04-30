const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const categoryModel = require("./models/category.model");

const categories = [
  {
    name: "Watches",
    description: "Exquisite timepieces from the world's most renowned horological houses.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000"
  },
  {
    name: "Handbags",
    description: "Iconic silhouettes and artisanal craftsmanship in the finest leathers.",
    image: "https://images.unsplash.com/photo-1584917033904-4911785adac7?auto=format&fit=crop&q=80&w=1000"
  },
  {
    name: "Fine Jewelry",
    description: "Brilliant diamonds and rare gemstones set in precious metals.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000"
  },
  {
    name: "Apparel",
    description: "Couture and ready-to-wear collections from leading fashion designers.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1000"
  },
  {
    name: "Fragrance",
    description: "Captivating scents and olfactory masterpieces.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1000"
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB...");

    for (const cat of categories) {
      const exists = await categoryModel.findOne({ name: cat.name });
      if (!exists) {
        await categoryModel.create(cat);
        console.log(`Added category: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

seedCategories();
