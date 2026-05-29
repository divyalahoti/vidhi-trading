process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);

const User = require('./models/User');
const Category = require('./models/Category');
const SubCategory = require('./models/SubCategory');
const Brand = require('./models/Brand');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await User.deleteMany();
  await Category.deleteMany();
  await SubCategory.deleteMany();
  await Brand.deleteMany();
  await Product.deleteMany();

  console.log('Creating admin user...');
  await User.create({
    name: 'Admin',
    email: 'admin@vidhitrading.com',
    password: 'admin123',
    role: 'admin'
  });

  console.log('Creating customers...');
  await User.create([
    {
      name: 'Rajesh Patel',
      email: 'rajesh@hariom.com',
      password: 'pass123',
      businessName: 'Hari Om Traders',
      gstNumber: '24ABCDE1234F1Z5',
      phone: '9876543210',
      address: { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' }
    },
    {
      name: 'Meena Shah',
      email: 'meena@shreekirana.com',
      password: 'pass123',
      businessName: 'Shree Kirana',
      gstNumber: '24XYZPQ5678G2H6',
      phone: '9876543211',
      address: { city: 'Surat', state: 'Gujarat', pincode: '395001' }
    },
  ]);

  console.log('Creating categories...');
  const spices  = await Category.create({ name: 'Spices & Masala',   slug: 'spices-masala',   description: 'All spices and masalas' });
  const grocery = await Category.create({ name: 'Grocery & Staples', slug: 'grocery-staples', description: 'Daily grocery items' });
  const oil     = await Category.create({ name: 'Oil & Ghee',        slug: 'oil-ghee',        description: 'Cooking oils and ghee' });
  const flour   = await Category.create({ name: 'Flour & Grains',    slug: 'flour-grains',    description: 'Wheat flour and grains' });

  console.log('Creating sub-categories...');
  await SubCategory.create({ name: 'Whole Spices',  slug: 'whole-spices',  category: spices._id });
  const masala    = await SubCategory.create({ name: 'Ground Masala', slug: 'ground-masala', category: spices._id });
  const edibleoil = await SubCategory.create({ name: 'Edible Oils',   slug: 'edible-oils',   category: oil._id });
  const ghee      = await SubCategory.create({ name: 'Ghee & Butter', slug: 'ghee-butter',   category: oil._id });
  const wheat     = await SubCategory.create({ name: 'Wheat Flour',   slug: 'wheat-flour',   category: flour._id });

  console.log('Creating brands...');
  const suhana     = await Brand.create({ name: 'Suhana',     slug: 'suhana',     origin: 'Maharashtra' });
  const ramdev     = await Brand.create({ name: 'Ramdev',     slug: 'ramdev',     origin: 'Gujarat' });
  const mdh        = await Brand.create({ name: 'MDH',        slug: 'mdh',        origin: 'Delhi' });
  const everest    = await Brand.create({ name: 'Everest',    slug: 'everest',    origin: 'Maharashtra' });
  const patanjali  = await Brand.create({ name: 'Patanjali',  slug: 'patanjali',  origin: 'Uttarakhand' });
  const tata       = await Brand.create({ name: 'Tata Salt',  slug: 'tata-salt',  origin: 'Mumbai' });
  const fortune    = await Brand.create({ name: 'Fortune',    slug: 'fortune',    origin: 'Ahmedabad' });
  const aashirvaad = await Brand.create({ name: 'Aashirvaad', slug: 'aashirvaad', origin: 'Gurugram' });

  console.log('Creating products...');
  await Product.create([
    { name: 'Suhana Biryani Masala 50g',      slug: 'suhana-biryani-masala-50g',   brand: suhana._id,     category: spices._id,  subCategory: masala._id,    price: 180, mrp: 220, minimumOrderQty: 12, stock: 500,  sku: 'SUH-BIR-50',  weight: '50g',  unit: 'pcs' },
    { name: 'Suhana Chhole Masala 100g',       slug: 'suhana-chhole-masala-100g',   brand: suhana._id,     category: spices._id,  subCategory: masala._id,    price: 95,  mrp: 115, minimumOrderQty: 24, stock: 300,  sku: 'SUH-CHH-100', weight: '100g', unit: 'pcs' },
    { name: 'Ramdev Red Chilli Powder 200g',   slug: 'ramdev-red-chilli-200g',      brand: ramdev._id,     category: spices._id,  subCategory: masala._id,    price: 95,  mrp: 110, minimumOrderQty: 24, stock: 800,  sku: 'RAM-RCP-200', weight: '200g', unit: 'pcs' },
    { name: 'Ramdev Turmeric Powder 200g',     slug: 'ramdev-turmeric-200g',        brand: ramdev._id,     category: spices._id,  subCategory: masala._id,    price: 75,  mrp: 90,  minimumOrderQty: 24, stock: 600,  sku: 'RAM-TUR-200', weight: '200g', unit: 'pcs' },
    { name: 'MDH Garam Masala 100g',           slug: 'mdh-garam-masala-100g',       brand: mdh._id,        category: spices._id,  subCategory: masala._id,    price: 120, mrp: 145, minimumOrderQty: 12, stock: 400,  sku: 'MDH-GAR-100', weight: '100g', unit: 'pcs' },
    { name: 'Everest Kitchen King Masala 100g',slug: 'everest-kitchen-king-100g',   brand: everest._id,    category: spices._id,  subCategory: masala._id,    price: 85,  mrp: 100, minimumOrderQty: 24, stock: 700,  sku: 'EVE-KKM-100', weight: '100g', unit: 'pcs' },
    { name: 'Patanjali Desi Ghee 1L',          slug: 'patanjali-desi-ghee-1l',      brand: patanjali._id,  category: oil._id,     subCategory: ghee._id,      price: 620, mrp: 695, minimumOrderQty: 6,  stock: 200,  sku: 'PAT-GHE-1L',  weight: '1L',   unit: 'pcs' },
    { name: 'Tata Salt 1kg',                   slug: 'tata-salt-1kg',               brand: tata._id,       category: grocery._id, subCategory: null,          price: 22,  mrp: 25,  minimumOrderQty: 48, stock: 2000, sku: 'TAT-SAL-1K',  weight: '1kg',  unit: 'pcs' },
    { name: 'Fortune Soyabean Oil 5L',         slug: 'fortune-soyabean-oil-5l',     brand: fortune._id,    category: oil._id,     subCategory: edibleoil._id, price: 780, mrp: 860, minimumOrderQty: 4,  stock: 150,  sku: 'FOR-SOY-5L',  weight: '5L',   unit: 'pcs' },
    { name: 'Aashirvaad Atta 10kg',            slug: 'aashirvaad-atta-10kg',        brand: aashirvaad._id, category: flour._id,   subCategory: wheat._id,     price: 450, mrp: 510, minimumOrderQty: 4,  stock: 300,  sku: 'ASH-ATT-10K', weight: '10kg', unit: 'bags' },
  ]);

  console.log('\n✅ Database seeded successfully!');
  console.log('─────────────────────────────────');
  console.log('Admin:    admin@vidhitrading.com  /  admin123');
  console.log('Customer: rajesh@hariom.com       /  pass123');
  console.log('─────────────────────────────────');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed error:', err.message);
  process.exit(1);
});