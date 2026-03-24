export const PRODUCT_CATEGORIES = {
  electronics: {
    name: "Electronics",
    attributes: [{ name: "Brand", type: "text" }],
    subCategories: {
      smartphones: {
        name: "Smartphones",
        attributes: [
          {
            name: "RAM",
            type: "select",
            values: ["4GB", "6GB", "8GB", "12GB"],
          },
          {
            name: "Storage",
            type: "select",
            values: ["64GB", "128GB", "256GB", "512GB"],
          },
          {
            name: "Color",
            type: "select",
            values: [
              "Black",
              "White",
              "Gray",
              "Silver",
              "Charcoal",

              "Red",
              "Maroon",
              "Crimson",
              "Burgundy",
              "Blue",
              "Navy",
              "Sky Blue",
              "Royal Blue",
              "Teal",
              "Green",
              "Olive",
              "Mint",
              "Lime",
              "Yellow",
              "Mustard",
              "Gold",
              "Orange",
              "Coral",
              "Peach",
              "Pink",
              "Hot Pink",
              "Rose",
              "Purple",
              "Lavender",
              "Violet",

              "Brown",
              "Beige",
              "Tan",
              "Khaki",

              "Multicolor",
              "Transparent",

              "Metallic",
              "Glossy",
              "Matte",
            ],
          },
        ],
        types: [
          "Android Phones",
          "iPhones",
          "Gaming Phones",
          "Refurbished Phones",
        ],
      },
      laptops: {
        name: "Laptops",
        attributes: [
          { name: "RAM", type: "select", values: ["8GB", "16GB", "32GB"] },
          {
            name: "Storage",
            type: "select",
            values: ["256GB SSD", "512GB SSD", "1TB SSD"],
          },
          { name: "Processor", type: "text" },
        ],
        types: [
          "Gaming Laptops",
          "Business Laptops",
          "Student Laptops",
          "MacBooks",
        ],
      },
      audio: {
        name: "Audio",
        attributes: [
          { name: "Color", type: "select", values: ["Black", "White"] },
          {
            name: "Connectivity",
            type: "select",
            values: ["Wired", "Wireless"],
          },
        ],
        types: ["Headphones", "Earbuds", "Speakers", "Soundbars"],
      },
      accessories: {
        name: "Accessories",
        attributes: [
          { name: "Compatibility", type: "text" },
          { name: "Color", type: "select", values: ["Black", "White"] },
        ],
        types: [
          "Chargers",
          "Power Banks",
          "Phone Cases",
          "Screen Protectors",
          "Cables",
        ],
      },
      wearables: {
        name: "Wearables",
        attributes: [
          { name: "Strap Material", type: "text" },
          { name: "Color", type: "select", values: ["Black", "Silver"] },
        ],
        types: ["Smart Watches", "Fitness Bands", "VR Headsets"],
      },
      cameras: {
        name: "Cameras",
        attributes: [
          { name: "Resolution", type: "text" },
          { name: "Lens Type", type: "text" },
        ],
        types: [
          "DSLR Cameras",
          "Mirrorless Cameras",
          "Action Cameras",
          "Camera Lenses",
        ],
      },
    },
  },

  fashion: {
    name: "Fashion",
    attributes: [],
    subCategories: {
      mens: {
        name: "Men",
        attributes: [
          { name: "Size", type: "select", values: ["S", "M", "L", "XL"] },
          {
            name: "Color",
            type: "select",
            values: ["Red", "Blue", "Black", "White"],
          },
          { name: "Fabric", type: "text" },
        ],
        types: [
          "T-Shirts",
          "Shirts",
          "Jeans",
          "Jackets",
          "Hoodies",
          "Shorts",
          "Formal Wear",
        ],
      },
      womens: {
        name: "Women",
        attributes: [
          { name: "Size", type: "select", values: ["XS", "S", "M", "L", "XL"] },
          {
            name: "Color",
            type: "select",
            values: ["Pink", "Red", "Black", "White"],
          },
        ],
        types: [
          "Dresses",
          "Tops",
          "Skirts",
          "Jeans",
          "Ethnic Wear",
          "Sarees",
          "Kurtis",
        ],
      },
      footwear: {
        name: "Footwear",
        attributes: [
          { name: "Size", type: "number" },
          {
            name: "Color",
            type: "select",
            values: ["Black", "White", "Brown"],
          },
        ],
        types: [
          "Sneakers",
          "Running Shoes",
          "Formal Shoes",
          "Boots",
          "Sandals",
          "Slippers",
        ],
      },
      accessories: {
        name: "Accessories",
        attributes: [
          { name: "Material", type: "text" },
          { name: "Color", type: "select", values: ["Black", "Brown"] },
        ],
        types: ["Belts", "Wallets", "Caps", "Sunglasses", "Bags"],
      },
    },
  },

  home: {
    name: "Home",
    attributes: [],
    subCategories: {
      furniture: {
        name: "Furniture",
        attributes: [
          {
            name: "Material",
            type: "select",
            values: ["Wood", "Metal", "Plastic"],
          },
          { name: "Dimensions", type: "text" },
        ],
        types: ["Beds", "Sofas", "Chairs", "Tables", "Wardrobes", "TV Units"],
      },
      kitchen: {
        name: "Kitchen",
        attributes: [
          { name: "Material", type: "text" },
          { name: "Capacity", type: "text" },
        ],
        types: [
          "Cookware",
          "Utensils",
          "Kitchen Appliances",
          "Storage Containers",
        ],
      },
      decor: {
        name: "Decor",
        attributes: [
          { name: "Material", type: "text" },
          { name: "Color", type: "text" },
        ],
        types: ["Wall Art", "Mirrors", "Clocks", "Lighting", "Vases"],
      },
      bedding: {
        name: "Bedding",
        attributes: [
          {
            name: "Size",
            type: "select",
            values: ["Single", "Double", "King"],
          },
          { name: "Material", type: "text" },
        ],
        types: ["Bedsheets", "Pillows", "Blankets", "Comforters"],
      },
    },
  },

  beauty: {
    name: "Beauty",
    attributes: [],
    subCategories: {
      skincare: {
        name: "Skincare",
        attributes: [
          { name: "Skin Type", type: "text" },
          { name: "Volume", type: "text" },
        ],
        types: ["Face Wash", "Moisturizers", "Serums", "Sunscreen"],
      },
      makeup: {
        name: "Makeup",
        attributes: [
          { name: "Shade", type: "text" },
          { name: "Finish", type: "text" },
        ],
        types: ["Lipstick", "Foundation", "Mascara", "Eye Shadow"],
      },
      haircare: {
        name: "Haircare",
        attributes: [
          { name: "Hair Type", type: "text" },
          { name: "Volume", type: "text" },
        ],
        types: ["Shampoo", "Conditioner", "Hair Oil", "Hair Styling"],
      },
      grooming: {
        name: "Grooming",
        attributes: [{ name: "Power Source", type: "text" }],
        types: ["Trimmers", "Shaving Kits", "Beard Care"],
      },
    },
  },

  sports: {
    name: "Sports",
    attributes: [],
    subCategories: {
      fitness: {
        name: "Fitness",
        attributes: [
          { name: "Weight", type: "text" },
          { name: "Material", type: "text" },
        ],
        types: ["Dumbbells", "Yoga Mats", "Resistance Bands", "Treadmills"],
      },
      outdoor: {
        name: "Outdoor",
        attributes: [{ name: "Material", type: "text" }],
        types: ["Camping Gear", "Hiking Gear", "Cycling"],
      },
      teamSports: {
        name: "Team Sports",
        attributes: [{ name: "Size", type: "text" }],
        types: ["Cricket", "Football", "Basketball", "Badminton"],
      },
    },
  },

  books: {
    name: "Books",
    attributes: [],
    subCategories: {
      fiction: {
        name: "Fiction",
        attributes: [
          { name: "Author", type: "text" },
          { name: "Language", type: "text" },
        ],
        types: ["Fantasy", "Mystery", "Romance", "Thriller"],
      },
      education: {
        name: "Education",
        attributes: [
          { name: "Author", type: "text" },
          { name: "Edition", type: "text" },
        ],
        types: ["Programming", "Science", "Mathematics", "Engineering"],
      },
      children: {
        name: "Children",
        attributes: [{ name: "Age Group", type: "text" }],
        types: ["Story Books", "Learning Books", "Activity Books"],
      },
      selfHelp: {
        name: "Self Help",
        attributes: [{ name: "Author", type: "text" }],
        types: ["Productivity", "Motivation", "Finance"],
      },
    },
  },

  grocery: {
    name: "Grocery",
    attributes: [],
    subCategories: {
      staples: {
        name: "Staples",
        attributes: [{ name: "Weight", type: "text" }],
        types: ["Rice", "Wheat", "Flour", "Pulses"],
      },
      snacks: {
        name: "Snacks",
        attributes: [
          { name: "Flavor", type: "text" },
          { name: "Weight", type: "text" },
        ],
        types: ["Chips", "Biscuits", "Chocolates", "Namkeen"],
      },
      beverages: {
        name: "Beverages",
        attributes: [{ name: "Volume", type: "text" }],
        types: ["Tea", "Coffee", "Juices", "Soft Drinks"],
      },
      dairy: {
        name: "Dairy",
        attributes: [{ name: "Volume", type: "text" }],
        types: ["Milk", "Butter", "Cheese", "Yogurt"],
      },
    },
  },

  jewellery: {
    name: "Jewellery",
    attributes: [],
    subCategories: {
      women: {
        name: "Women Jewellery",
        attributes: [
          { name: "Material", type: "text" },
          { name: "Color", type: "text" },
        ],
        types: ["Necklaces", "Earrings", "Rings", "Bracelets", "Anklets"],
      },
      men: {
        name: "Men Jewellery",
        attributes: [{ name: "Material", type: "text" }],
        types: ["Chains", "Bracelets", "Rings"],
      },
      luxury: {
        name: "Luxury",
        attributes: [
          { name: "Material", type: "text" },
          { name: "Purity", type: "text" },
        ],
        types: ["Gold Jewellery", "Diamond Jewellery", "Platinum Jewellery"],
      },
    },
  },

  toys: {
    name: "Toys",
    attributes: [],
    subCategories: {
      kids: {
        name: "Kids",
        attributes: [{ name: "Age Group", type: "text" }],
        types: ["Action Figures", "Dolls", "Educational Toys"],
      },
      boardGames: {
        name: "Board Games",
        attributes: [{ name: "Players", type: "number" }],
        types: ["Chess", "Monopoly", "Puzzle Games"],
      },
      remoteControl: {
        name: "Remote Control",
        attributes: [{ name: "Battery Type", type: "text" }],
        types: ["RC Cars", "RC Drones", "RC Boats"],
      },
    },
  },

  auto: {
    name: "Auto",
    attributes: [],
    subCategories: {
      carAccessories: {
        name: "Car Accessories",
        attributes: [{ name: "Compatibility", type: "text" }],
        types: ["Seat Covers", "Car Chargers", "Dash Cameras", "Car Perfumes"],
      },
      bikeAccessories: {
        name: "Bike Accessories",
        attributes: [{ name: "Size", type: "text" }],
        types: ["Helmets", "Bike Covers", "Riding Gloves"],
      },
      maintenance: {
        name: "Maintenance",
        attributes: [{ name: "Volume", type: "text" }],
        types: ["Engine Oil", "Car Wash", "Cleaning Kits"],
      },
    },
  },
} as const;

export type CategoryKey = keyof typeof PRODUCT_CATEGORIES;

export type SubCategoryKey<T extends CategoryKey> =
  keyof typeof PRODUCT_CATEGORIES[T]["subCategories"];

  

