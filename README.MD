# README - Database Model Documentation

## Overview
This document describes the database model for an e-commerce and service booking application. The model includes entities for user management, notifications, shopping carts, purchases, messaging, services, appointments, and products.

## Entity Relationship Diagram

### Main Entities

#### Users
- Stores user account information including authentication details and profile data
- Fields: idUser, name, password, token, email, photo, phoneNumber, role, status, createdin, updatedin

#### Notifications
- Tracks system notifications for users
- Fields: idNotification, icon, description, notificationTime, read, idUser, createdin, updatedin

#### Carts
- Manages shopping cart instances
- Fields: idCart, idUser, status

#### CartProducts
- Contains products added to carts
- Fields: idCartProduct, idProduct, idCart, productName, priceInCents, status

#### PurchaseProducts
- Records completed purchases
- Fields: idPurchaseProduct, idShopping, idProduct, priceInCents, productName, paymentMethod, createdin, updatedin

#### Chats
- Manages chat sessions between users
- Fields: idChat, idUser, idUser2, createdin

#### Messages
- Stores chat messages
- Fields: idMessage, description, createdin, updatedin, idUser, idChat, username

#### Services
- Catalog of available services
- Fields: idService, name, price_in_cents, duration, benefits, reviews, status, category, updatedin, createdin

#### Appointments
- Tracks service appointments
- Fields: idAppointment, appointmentTime, appointmentDate, status, employeeName, name, email, phoneNumber, employeePhoneNumber, employeeEmail, idService, idUser, idEmployee

#### Products
- Catalog of available products
- Fields: idProduct, name, description, price_in_cents, status, category, updatedin, createdin, amount

## Relationships

1. **Users have Notifications**: One-to-many (User → Notification)
2. **Users have Carts**: One-to-many (User → Cart)
3. **Carts contain CartProducts**: One-to-many (Cart → CartProduct)
4. **Users participate in Chats**: Many-to-many (User ↔ Chat through two foreign keys)
5. **Chats contain Messages**: One-to-many (Chat → Message)
6. **Users make Appointments**: One-to-many (User → Appointment)
7. **Services are booked in Appointments**: One-to-many (Service → Appointment)
8. **Products are purchased in PurchaseProducts**: One-to-many (Product → PurchaseProduct)

## Usage Notes

- All entities include `createdin` and `updatedin` timestamps for audit purposes
- Status fields use `TIMYINT` (likely meant to be TINYINT) for boolean/status flags
- Price fields are stored in cents to avoid floating-point precision issues
- The model supports both product sales and service appointments

## Indexes
All tables have indexes defined (implied by the "## Indexes" sections), though specific index columns aren't detailed in this diagram. Typically, primary keys and foreign keys should be indexed.

## Potential Improvements
1. Consider normalizing some duplicated fields (like employee contact info in Appointments)
2. Add foreign key constraints where relationships exist
3. Consider using ENUM types for status fields
4. Standardize on TIMESTAMP or DATETIME consistently
5. Verify all VARCHAR lengths match business requirements