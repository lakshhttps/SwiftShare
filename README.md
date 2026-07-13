# ⚡ SwiftShare - Peer-to-Peer File Transfer, Instantly
**SwiftShare** is a fast, no-friction web app that transfers files directly between two devices using **WebRTC** — no uploads, no accounts, no size limits.
Create a room, share the code (or scan a QR), and files stream straight from one browser to the other in real time.
---
## ✨ Features
### 🔐 Room-Based Sharing
- Create a room and get a 6-digit code instantly
- Join from another device using the code, or scan a **QR code** for one-tap join
### ⚡ Direct P2P Transfer
- Files move **directly between devices** via WebRTC data channels — nothing passes through the server
- Live **progress bar and transfer speed** shown in real time for every file
### 🔄 Reliable Connections
- Automatically **reconnects** and rejoins your room if the connection drops
- Recovers from failed peer connections without manual retry
### 🌓 Clean, Responsive UI
- Works across desktop and mobile browsers
- Toggleable **dark mode**
---
## 📲 How to Run the App
### Prerequisites
- Node.js 18+
- npm
### Steps:
1. **Clone the repository:**
```bash
   git clone https://github.com/lakshhttps/SwiftShare.git
```
2. **Set up the backend:**
```bash
   cd SwiftShare/backend
   npm install
   cp .env.example .env
   npm run dev
```
3. **Set up the frontend (in a new terminal):**
```bash
   cd SwiftShare/frontend
   npm install
   cp .env.example .env
   npm run dev
```
4. **Test it:**
   - Open `http://localhost:5173` in two browser tabs (or two devices on the same network)
   - Create a room in one, join from the other, and send a file
---
## 📦 App Availability
SwiftShare runs entirely in the browser — **no APK, no install required.** Just open the web link below on any modern desktop or mobile browser.
---
## 📎 WebApp Link
👉  [SwiftShare Web](https://swift-share-ashen.vercel.app/)
---
## 📜 License
This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.
---
## 🙋 Author
Built with ❤️ by **lakshhttps**
- 🔗 [GitHub Profile](https://github.com/lakshhttps)
- 💼 [LinkedIn](https://www.linkedin.com/in/laksh-arora-490ba725b/)
- 🐦 [X (Twitter)](https://x.com/luckshhyyy)

If you found this useful, consider starring ⭐ the repository and sharing with others!
---
> 🏷️ Send Anything, Anywhere, Instantly.
