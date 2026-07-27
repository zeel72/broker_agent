# Product Requirements Document: Single-User Broker Application

## 1. Overview
The goal is to build a simple, efficient, and easy-to-use web application for a real estate broker to manage property data, replacing their existing Excel-based workflow. The application will act as a centralized digital ledger for properties (plots, flats, and rental houses) and will be used exclusively by a single user (the broker).

## 2. Target Audience
- **Primary User:** Real Estate Broker (Single Admin User).
- **Permissions:** Full access to add, edit, delete, and view all data. No other users or public-facing views are required.

## 3. Core Features

### 3.1 Authentication
- Simple secure login screen (Username/Password).
- Only one predefined admin account is needed.

### 3.2 Property Management (CRUD)
The broker must be able to Create, Read, Update, and Delete properties.

**Property Types:**
1. **Plots:** Land available for sale.
2. **Flats/Houses (Sale):** Constructed properties available for purchase.
3. **Flats/Houses (Rent):** Constructed properties available for rent.

**Core Data Fields (Common to all):**
- **Title/Name:** A quick identifier (e.g., "3BHK Sunrise Apartments").
- **Area/Location:** The locality or neighborhood (Crucial for filtering).
- **Price/Rent:** Expected price or monthly rent.
- **Status:** Available, Sold, Rented, or Hold.
- **Owner Details:** Name and Contact Number of the property owner.
- **Notes/Remarks:** Open text field for any additional broker-specific information.

**Specific Data Fields:**
- **Plots:** Size (sq. yards / sq. feet), Facing direction, Boundary wall (Yes/No).
- **Flats/Houses:** Configuration (1BHK, 2BHK, etc.), Furnishing status (Furnished, Semi, Unfurnished), Floor number.

### 3.3 Dashboard and Data View
- A clean, table-based or grid-based view of all properties (similar to Excel but better formatted).
- Visual indicators for Property Status (e.g., Green for Available, Red for Sold).

### 3.4 Search and Filtering (Primary Requirement)
- **Area-Based Filter:** A prominent dropdown or search bar that allows the broker to select or type an "Area" (e.g., "Downtown", "Westside"). 
  - *Action:* Selecting an area instantly filters the view to show **all** property types (Plots, Flats for Sale, Houses for Rent) located in that specific area.
- **Secondary Filters:** 
  - Filter by Property Type (Rent vs. Sell, Plot vs. Flat).
  - Filter by Status (Show only "Available" properties).

## 4. Non-Functional Requirements
- **Simplicity:** The UI must be intuitive and straightforward. The broker is moving away from Excel, so the transition should be frictionless.
- **Speed:** Instant filtering without page reloads (using client-side or fast server-side filtering).
- **Mobile-Friendly:** The application should be responsive so the broker can check inventory on their phone while on the go.

## 5. Technology Stack
Based on the provided MERN stack requirement:
- **Frontend:** React.js (via Vite) with a modern styling framework for a fast, responsive, and premium user interface.
- **Backend:** Node.js with Express.js.
- **Database:** MongoDB for robust, flexible data storage.
- **Deployment:** Vercel/Netlify for the frontend, and a Node-compatible host (e.g., Render, Railway) for the backend.

## 6. Future Enhancements (Post-V1)
- **Image Uploads:** Ability to attach photos to property listings.
- **Client Matches:** A feature to store buyer/tenant requirements and automatically match them with available inventory.
- **Export to Excel/PDF:** Allow the broker to export filtered lists to share with clients.
