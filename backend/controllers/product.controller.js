// productController.js

import mongoose from 'mongoose';
import Product from '../models/products.model.js';

const getAllProducts = async (req, res) => {
    try {
        // --- MOCK MODE FALLBACK ---
        if (mongoose.connection.readyState !== 1) {
            console.log("Database not connected. Using Mock Mode for products.");
            const mockProducts = [
                { 
                    _id: "p1", name: "Naruto Figure", price: 25, description: "Awesome Ninja Figure", category: "Figures",
                    imageURL: "/images/products/naruto_figure.png" 
                },
                { 
                    _id: "p2", name: "One Piece Poster", price: 15, description: "Wanted Poster for Luffy", category: "Posters",
                    imageURL: "/images/products/one_piece_poster.png" 
                },
                { 
                    _id: "p3", name: "Death Note Notebook", price: 10, description: "Kira's Notebook Replica", category: "Accessories",
                    imageURL: "/images/products/death_note_notebook.png" 
                },
                { 
                    _id: "p4", name: "Attack on Titan Cape", price: 30, description: "Survey Corps Uniform Cape", category: "Apparel",
                    imageURL: "/images/products/aot_cape.png" 
                },
                { 
                    _id: "p5", name: "Dragon Ball Z T-Shirt", price: 20, description: "Goku Super Saiyan Tee", category: "Apparel",
                    imageURL: "/images/products/dbz_tshirt.png" 
                },
                { 
                    _id: "p6", name: "Demon Slayer Sword", price: 45, description: "Tanjiro's Nichirin Blade Replica", category: "Props",
                    imageURL: "/images/products/demon_slayer_sword.png" 
                },
                { 
                    _id: "p7", name: "My Hero Academia Hoodie", price: 35, description: "Deku Hero Costume Hoodie", category: "Apparel",
                    imageURL: "/images/products/hero_academia_hoodie.png" 
                },
                { 
                    _id: "p8", name: "Jujutsu Kaisen Keychain", price: 8, description: "Gojo Satoru Chibi Keychain", category: "Accessories",
                    imageURL: "/images/products/jujutsu_kaisen_keychain.png" 
                },
                { 
                    _id: "p9", name: "Evangelion Unit-01 Model", price: 65, description: "Highly detailed EVA-01 mech figure kit", category: "Figures",
                    imageURL: "/images/products/evangelion_unit_01_model.jpg" 
                },
                { 
                    _id: "p10", name: "Bleach Zanpakuto Umbrella", price: 35, description: "Ichigo's Zangetsu replica umbrella", category: "Props",
                    imageURL: "/images/products/bleach_zanpakuto_umbrella.jpg" 
                },
                { 
                    _id: "p11", name: "Hunter x Hunter License", price: 15, description: "Official Hunter Association metal card", category: "Accessories",
                    imageURL: "/images/products/hunter_x_hunter_license.jpg" 
                },
                { 
                    _id: "p12", name: "Akira Kaneda Jacket", price: 120, description: "Premium red faux-leather biker jacket", category: "Apparel",
                    imageURL: "/images/products/akira_kaneda_jacket.jpg" 
                },
                { 
                    _id: "p13", name: "Fullmetal Alchemist Watch", price: 45, description: "Edward Elric's State Alchemist silver watch", category: "Accessories",
                    imageURL: "/images/products/fullmetal_alchemist_watch.jpg" 
                },
                { 
                    _id: "p14", name: "JoJo Tarot Cards Set", price: 25, description: "Complete Stardust Crusaders tarot deck", category: "Posters",
                    imageURL: "/images/products/jojo_tarot_cards.jpg" 
                },
                { 
                    _id: "p15", name: "Sword Art Online Elucidator", price: 50, description: "Kirito's signature black sword replica", category: "Props",
                    imageURL: "/images/products/sword_art_online_elucidator.jpg" 
                },
                { 
                    _id: "p16", name: "Cyberpunk David's Jacket", price: 90, description: "Edgerunners yellow EMT reflective jacket", category: "Apparel",
                    imageURL: "/images/products/cyberpunk_david_jacket.jpg" 
                },
                { 
                    _id: "p17", name: "Chainsaw Man Pochita Plush", price: 20, description: "Soft and huggable Pochita demon companion", category: "Figures",
                    imageURL: "/images/products/chainsaw_man_pochita_plush.jpg" 
                },
                { 
                    _id: "p18", name: "Tokyo Ghoul Kaneki Mask", price: 40, description: "Premium leather replica of Kaneki's eye patch mask", category: "Props",
                    imageURL: "/images/products/tokyo_ghoul_kaneki_mask.jpg" 
                },
                { 
                    _id: "p19", name: "Genshin Impact Anemo Vision", price: 22, description: "Luminous Mondstadt Vision glass keychain", category: "Accessories",
                    imageURL: "/images/products/genshin_impact_anemo_vision.jpg" 
                },
                { 
                    _id: "p20", name: "Spirited Away No-Face Bank", price: 28, description: "Automated No-Face coin eating piggy bank", category: "Figures",
                    imageURL: "/images/products/spirited_away_no_face_bank.jpg" 
                },
                { 
                    _id: "p21", name: "Cowboy Bebop Spike Pistol", price: 80, description: "Jericho 941 weighted replica prop", category: "Props",
                    imageURL: "/images/products/cowboy_bebop_spike_pistol.jpg" 
                },
                { 
                    _id: "p22", name: "Sailor Moon Crescent Wand", price: 30, description: "Moon Stick with light-up Silver Crystal", category: "Props",
                    imageURL: "/images/products/sailor_moon_crescent_wand.jpg" 
                }
            ];
            return res.json(mockProducts);
        }
        // --- END MOCK MODE ---

        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createProduct = async (req, res) => {
    const product = new Product(req.body);
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};
