# Futurent Technology - Security Specification

## 1. Data Invariants
- Public visitors may read published content: `siteSettings`, `serviceCategories`, `services`, `pageSections`, `portfolioProjects`, `testimonials`, `faqs`.
- Orders, custom requests, and contact messages can only be created with strict field validation, lengths, and valid contact information.
- Public visitors cannot read any orders, custom requests, contact messages, admin roles, or activity logs.
- Admin access is restricted to verified administrators (`admins` collection or bootstrapped administrator `mdshihabhossen.web@gmail.com`).
- Critical mutations (updating order status, deleting content, reading client contact details) require administrator authorization.
- Timestamps and reference IDs must follow valid formats; oversized payloads (> 5KB text, spoofed admin fields) are strictly rejected.

## 2. The Dirty Dozen Payloads (Negative Tests)
1. Unauthenticated reading of `/orders/` collection -> REJECTED (PERMISSION_DENIED).
2. Unauthenticated reading of `/contactMessages/` collection -> REJECTED (PERMISSION_DENIED).
3. Spoofing admin write to `/admins/{uid}` without super admin authorization -> REJECTED.
4. Injecting oversized string (> 5000 chars) into `/orders` requirements -> REJECTED.
5. Creating an order with missing required fields (`fullName`, `email`, `requirements`) -> REJECTED.
6. Public user attempting to update `/orders/{orderId}/status` to 'approved' -> REJECTED.
7. Public user attempting to delete a `/services/{serviceId}` document -> REJECTED.
8. Unauthenticated modification of `/siteSettings/global` -> REJECTED.
9. Ghost field injection on order creation (e.g., `isAdmin: true`, `discount: 100`) -> REJECTED.
10. Unauthenticated read of `/activityLogs` -> REJECTED.
11. Reading another customer's custom project request -> REJECTED.
12. Attempting to update `createdAt` on an existing order -> REJECTED.
