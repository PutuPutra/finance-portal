# Finance Portal

A responsive finance portal application with authentication, dashboard, and transaction management features.

## Run Locally

1. **Clone the repository**

   ```shell
   git clone https://github.com/PutuPutra/finance-portal.git
   ```

````

2. **Install dependencies and run the development server**

   ```shell
   npm install --legacy-peer-deps
   npm run dev
   ```

3. **Authentication**

   Use the following credentials to log in:

   - **Username:** user
   - **Password:** password

## Contact Developer

For any inquiries, please email: [putupersada@gmail.com](mailto:putupersada@gmail.com)

## Project Structure

- **src/app/layout.tsx:** Defines the root layout of the application.
- **src/app/page.tsx:** The main page of the application.
- **src/app/dashboard/page.tsx:** The dashboard page, accessible after login.
- **src/actions/auth.ts:** Contains authentication-related actions (login, logout, checkAuth).
- **src/actions/transactions.ts:** Contains actions to fetch transactions.
- **src/components:** Contains various UI components used in the application.
- **src/middleware/index.ts:** Middleware for handling authentication and route protection.
- **src/types/transaction.ts:** Type definitions for transactions.

## Features

- **Authentication:** Users can log in with a username and password. The session is maintained using cookies.
- **Dashboard:** Authenticated users can access the dashboard to view and manage transactions.
- **Transaction Management:** Users can view, filter, and export transaction data.
- **Responsive Design:** The application is designed to be responsive and works well on both desktop and mobile devices.

```


````
