# Anime Streaming Website
![Site Preview](preview.gif)

A professional, high-fidelity anime streaming and social platform featuring a cinematic user interface, personalized content organization, and real-time community interactions.

## 🌟 Key Features

### 🎬 Streaming Experience
- **Cinematic Featured Hero:** An impactful top section showcasing the #1 trending anime with dynamic visuals and summaries.
- **Personalized Watchlist:** A persistent "Save for Later" system that syncs across devices (powered by a dedicated backend).
- **Netflix-Style Curation:** Browse through **20+ major genre categories** (Action, Romance, Sci-Fi, etc.) in horizontal scrolling shelves.
- **Instant Loading:** High-performance **LocalStorage Caching** ensures the Home page rows load instantly on refresh.
- **Global Arcade Search:** Unified search bar in the Navbar for both Anime streaming and Store inventory.

### 💬 Social & Community
- **Real-Time Messaging:** Secure, instant chat with other fans using **Socket.io**.
- **User Presence:** Live indicators showing who is currently online in the community.
- **Interactive Profiles:** Personalized avatars and activity tracking.

### 🛒 Anime Store
- **Full-Featured Catalog:** Browse and buy premium anime merchandise and figures.
- **Integrated Wishlist:** Save store items separate from your anime watchlist.

### 🛠️ Technical Excellence
- **MERN Stack:** MongoDB, Express, React, and Node.js.
- **JWT Protection:** Secure, cookie-based authentication and authorization.
- **Optimized API Usage:** Staggered loading and debouncing to handle high-frequency Jikan API requests safely.
- **Fallback Persistence:** A persistent JSON-based mock database for reliable development even when the primary DB is offline.




### Setup .env file

```js
PORT=...
MONGO_DB_URI=...
JWT_SECRET=...
NODE_ENV=...
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```
