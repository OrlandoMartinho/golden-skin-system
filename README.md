# README - Golden Skin System E-Commerce Platform

## System Overview
Golden Skin System is a comprehensive e-commerce platform for beauty and wellness services, combining product sales with service bookings. The system features user management, shopping functionality, appointment scheduling, and communication tools.

## Database Schema

### Core Entities

#### Users
- **Fields**: password, name, email, photo, role, phoneNumber, createdIn, updatedIn
- **Methods**: 
  - Authentication: authenticate(), changePassword(), recoverPassword()
  - Profile Management: register(), update(), uploadPhoto()
  - Account Actions: delete(), changeEmail()

#### Products
- **Fields**: name, description, priceInCents, status, category, amount, photo, createdIn, updatedIn
- **Methods**: register(), update(), delete(), viewA(), viewAll(), uploadPhoto()

#### Services
- **Fields**: name, description, priceInCents, benefits, reviews, duration, category, photo, updatedIn
- **Methods**: add(), edit(), delete(), viewA(), viewAll(), uploadPhoto()

### Shopping System

#### Carts
- **Fields**: idCart, idUser, status
- **Methods**: add(), delete(), viewA(), viewAll()

#### CartProducts
- **Fields**: idCart, idProduct, description, productName, priceInCents, status, createdIn
- **Methods**: register(), delete(), response(), viewA(), viewAll()

#### Shoppings (Orders)
- **Fields**: idUser, status
- **Methods**: register(), update(), delete(), viewA(), viewAll()

#### PurchaseProducts
- **Fields**: idShopping, idProduct, priceInCents, productName, paymentMethod, createdIn, updatedIn
- **Methods**: register(), update(), delete(), viewA(), viewAll()

### Communication Features

#### Messages
- **Fields**: description, idUser, idChat, username, createdIn, updatedIn
- **Methods**: register(), delete(), update(), viewAll(), viewA()

#### Notifications
- **Fields**: icon, description, notificationTime, read, createdIn, updatedIn, idUser
- **Methods**: add(), read(), delete(), viewA(), viewAll()

## Key Features

1. **User Management**:
   - Secure authentication and password recovery
   - Profile customization with photo uploads
   - Role-based access control

2. **E-Commerce System**:
   - Product catalog with categories and status tracking
   - Shopping cart functionality
   - Order processing and purchase history

3. **Service Management**:
   - Service catalog with detailed descriptions
   - Pricing and duration information
   - Review system

4. **Communication Tools**:
   - Real-time messaging system
   - Notification center with read status

## Technical Specifications

- **Data Types**:
  - Prices stored in cents to avoid floating-point issues
  - Timestamps for all created/updated records
  - Boolean status fields for active/inactive tracking

- **Common Methods**:
  - CRUD operations (Create, Read, Update, Delete)
  - Individual (viewA) and batch (viewAll) viewing capabilities
  - Specialized methods per entity (uploadPhoto, authenticate, etc.)

## Business Logic

1. **Order Flow**:
   - Products added to Cart → Converted to CartProducts → Processed as PurchaseProducts
   - Shoppings entity tracks overall order status

2. **User Engagement**:
   - Notifications for important events
   - Messaging system for user communication
   - Review system for services

## Potential Improvements

1. Add relationship diagrams between entities
2. Implement more detailed order status tracking
3. Enhance notification system with different priority levels
4. Add inventory management for products
5. Implement service scheduling functionality

## Usage Notes

- All monetary values are stored in cents (priceInCents)
- Timestamps follow ISO format (createdIn, updatedIn)
- Status fields use boolean values except where noted
- Photo fields store paths/references to image files

