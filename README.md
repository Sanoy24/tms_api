# tms_api

# Task Management App

## Overview

This is a Task Management System REST api built using Node.js, Express and mongodb.

## Getting Started

To run this app locally, follow these steps:

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or later)
- npm (Node Package Manager)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Sanoy24/tms_api.git
   cd tms_api
   ```

2. **Install Dependecies**

   ```bash
   npm install
   ```

3. **Create Environment File**

Create a .env file in the root directory of the project with the following variables:

```
PORT=3000
JWT_SECRET=your_jwt_secret
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:3000
```
