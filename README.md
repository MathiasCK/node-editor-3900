## Prerequisites 📋

Before you get started, make sure you have the following requirements in place:

- [.NET Core SDK](https://dotnet.microsoft.com/download) (v8.0.203) - Verify by running `dotnet --version` ✔️
- [npm](https://www.npmjs.com/) (v10.5.0) - Verify by running `npm --version` ✔️
- [node](https://nodejs.org/en) (v20.12.0) - Verify by running `node --version` ✔️

## Setup ⚙️

To get a local copy up and running, follow these simple steps from your terminal:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/MathiasCK/node-editor.git
   ```

2. **Navigate to the project folder**

   ```bash
   cd node-editor
   ```

3. **Install root & client dependencies**

   ```bash
   npm install
   ```

4. **Install server dependencies**

   ```bash
   npm run server:init
   ```

5. **Build server**

   ```bash
   npm run server:build
   ```

## Running the Project 🚀

### Development Mode 🔧

1. **Start both the server and client**:

   ```bash
   npm run start:dev
   ```

The server will be accessible at [http://localhost:5000](http://localhost:5000), and the client will be running on [http://localhost:5173](http://localhost:5173).

### Production Mode 🌐

1. **Build the client**:

   ```bash
   npm run client:build
   ```

2. **Start both the server and client**:

   ```bash
   npm start
   ```

The server will be accessible at [http://localhost:5000](http://localhost:5000), and the client will be running on [http://localhost:3000](http://localhost:3000).

### Logging In 🔑

- **Default Credentials**:

  - **Username**: `admin`
  - **Password**: `admin`


