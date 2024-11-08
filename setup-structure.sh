#!/bin/bash

# Create main directory structure
mkdir -p src/app/{auth,shop,dashboard,api}
mkdir -p src/components/{auth,common,layout,products,shop}
mkdir -p src/lib/{appwrite,utils,constants}
mkdir -p src/hooks
mkdir -p src/types

# Create auth routes
mkdir -p src/app/auth/{login,register,verify}
touch src/app/auth/login/page.js
touch src/app/auth/register/page.js
touch src/app/auth/verify/page.js

# Create shop routes
mkdir -p src/app/shop/{products,cart,checkout}
touch src/app/shop/products/page.js
touch src/app/shop/cart/page.js
touch src/app/shop/checkout/page.js

# Create dashboard routes
mkdir -p src/app/dashboard/admin/{orders,products,users}
touch src/app/dashboard/admin/orders/page.js
touch src/app/dashboard/admin/products/page.js
touch src/app/dashboard/admin/users/page.js

# Create API routes
mkdir -p src/app/api/{auth,products,orders}
touch src/app/api/auth/route.js
touch src/app/api/products/route.js
touch src/app/api/orders/route.js

# Create component structure
mkdir -p src/components/common/{Button,Input,Modal,Toast}
mkdir -p src/components/layout/{Header,Footer,Sidebar}

# Create initial files
