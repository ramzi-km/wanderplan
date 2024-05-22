
# Wanderplan

Wanderplan is a comprehensive web application designed to streamline the process of planning trips with friends. By integrating multiple functionalities such as note-taking, mapping, and chatting into a single platform, Wanderplan eliminates the need to toggle between different apps for trip planning. This one-stop solution enhances the trip planning experience, making it more efficient and enjoyable.

## Live Demo

Check out Wanderplan in action [here](https://wanderplan.online/).




## Features

- Light/dark mode toggle
- Secure Authentication: Register and log in securely with JWT and Google OAuth integrations.
- Unified Trip Planning: Plan your trip using a single application that combines maps, notes, and chat functionalities.
- Collaboration: Seamlessly collaborate with friends on travel plans and itineraries.
- Real-Time Chat: Communicate with travel companions in real-time using integrated chat functionality.
- User-Friendly Interface: Leveraging Tailwind CSS and SCSS for an appealing and intuitive user experience.
- Interactive Maps: Utilize the Mapbox API for visually rich and interactive mapping features.
- Travel Guides: Access and share comprehensive travel guides offering insights and recommendations.


## Tech Stack

**Client:** Angular, NgRx, TailwindCSS

**Server:** Node.js, Express.js, MongoDB

**APIs:** Mapbox, Unsplash, Wikipedia, and Google OAuth


## Installation

#### Prerequisites

- Node.js (v16.20.2)
- Angular (v16)

#### Setting Up

1. Clone the repository: 

```bash
git clone https://github.com/ramzi-km/wanderplan.git
cd wanderplan

```
2. Set up environment variables:
Backend .env file:

```bash
PORT='3000'
DB_URI=[Your MongoDB URI]
CLIENT_URL=[Your Client URL]
JWT_SECRET_KEY=[Your JWT Secret Key]
JWT_SECRET_KEY_ADMIN=[Your JWT Admin Secret Key]
SESSION_SECRET_KEY=[Your Session Secret Key]
EMAIL=[Your Email]
PASS=[Your Email Password]
CLOUD_NAME=[Your Cloudinary Cloud Name]
CLOUDINARY_SECRET=[Your Cloudinary Secret]
CLOUDINARY_KEY=[Your Cloudinary Key]
UNSPLASH_KEY=[Your Unsplash API Key]
GOOGLE_CLIENT_ID=[Your Google Client ID]

```
Frontend src/environments/environment.prod.ts:
```bash
API_URL=[Your API URL]
MAPBOX_TOKEN=[Your Mapbox Token]
GOOGLE_CLIENT_ID=[Your Google Client ID]

```
3. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

```
## Usage/Examples
1. Start the backend server:
```bash
cd backend
npm start

```
2. Start the Angular frontend:
```bash
cd frontend
ng serve

```
3. Access the app at http://localhost:4200.
