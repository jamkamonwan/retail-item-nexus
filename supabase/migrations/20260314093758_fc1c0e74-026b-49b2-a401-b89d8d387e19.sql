
-- Clear old mock data
TRUNCATE public.audit_logs;

-- Insert realistic audit log data with human-readable details
INSERT INTO public.audit_logs (event_type, actor_id, target_user_id, entity_type, entity_id, metadata, ip_address, user_agent, created_at) VALUES

-- Day 1: Admin creates supplier admin user
('USER_CREATED', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'user', 'b1000000-0000-0000-0000-000000000001',
 '{"user_name": "Somchai Unilever", "email": "somchai@unilever.com", "role": "supplier_admin", "user_type": "external", "supplier_group": "Unilever Group", "created_by": "Admin User"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '14 days'),

('USER_ROLE_ASSIGNED', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'user_role', 'supplier_admin',
 '{"role": "supplier_admin", "assigned_by": "Admin User", "user_name": "Somchai Unilever"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '14 days' + interval '1 minute'),

('USER_INVITATION_SENT', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'user', 'b1000000-0000-0000-0000-000000000001',
 '{"email": "somchai@unilever.com", "user_name": "Somchai Unilever", "sent_by": "Admin User"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '14 days' + interval '2 minutes'),

-- Day 2: Supplier admin first login
('FIRST_LOGIN', 'b1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'user', 'b1000000-0000-0000-0000-000000000001',
 '{"user_name": "Somchai Unilever", "email": "somchai@unilever.com", "role": "supplier_admin"}',
 '203.150.44.22', 'Mozilla/5.0 (Macintosh) Safari/17.2', now() - interval '13 days'),

('PASSWORD_RESET_SUCCESS', 'b1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'user', 'b1000000-0000-0000-0000-000000000001',
 '{"user_name": "Somchai Unilever", "reason": "first_login_password_change"}',
 '203.150.44.22', 'Mozilla/5.0 (Macintosh) Safari/17.2', now() - interval '13 days' + interval '5 minutes'),

-- Day 2: Supplier admin accepts terms
('TERMS_VIEWED', 'b1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'terms', 'v2.1',
 '{"version": "v2.1", "user_name": "Somchai Unilever", "document": "Supplier Portal Terms & Conditions"}',
 '203.150.44.22', 'Mozilla/5.0 (Macintosh) Safari/17.2', now() - interval '13 days' + interval '10 minutes'),

('TERMS_ACCEPTED', 'b1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'terms', 'v2.1',
 '{"version": "v2.1", "user_name": "Somchai Unilever", "document": "Supplier Portal Terms & Conditions", "accepted_at": "2026-03-01T10:15:00Z"}',
 '203.150.44.22', 'Mozilla/5.0 (Macintosh) Safari/17.2', now() - interval '13 days' + interval '15 minutes'),

-- Day 3: Admin creates internal buyer user
('USER_CREATED', 'a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'user', 'c1000000-0000-0000-0000-000000000001',
 '{"user_name": "Sarah Buyer", "email": "sarah.buyer@bigc.co.th", "role": "buyer", "user_type": "internal", "department": "Procurement", "created_by": "Admin User"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '12 days'),

('USER_ROLE_ASSIGNED', 'a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'user_role', 'buyer',
 '{"role": "buyer", "assigned_by": "Admin User", "user_name": "Sarah Buyer", "permissions": ["can_approve", "can_reject", "can_revise"]}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '12 days' + interval '1 minute'),

-- Day 4: Admin creates supplier user and assigns to supplier
('USER_CREATED', 'a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'user', 'd1000000-0000-0000-0000-000000000001',
 '{"user_name": "Pranee Vendor", "email": "pranee@cpfoods.co.th", "role": "supplier", "user_type": "external", "supplier_group": "CP Foods Group", "created_by": "Admin User"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '10 days'),

('SUPPLIER_USER_ASSIGNED', 'a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'supplier', 'supplier-003',
 '{"supplier_name": "Fresh Produce Co", "supplier_code": "10003", "user_name": "Pranee Vendor", "assigned_by": "Admin User"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '10 days' + interval '2 minutes'),

-- Day 5: Module assignments
('USER_ROLE_ASSIGNED', 'a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'module', 'new_item',
 '{"module_name": "New Item Creation", "user_name": "Pranee Vendor", "assigned_by": "Admin User", "action": "module_assigned"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '9 days'),

('USER_ROLE_ASSIGNED', 'a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'module', 'supply_chain',
 '{"module_name": "Supply Chain Management", "user_name": "Pranee Vendor", "assigned_by": "Admin User", "action": "module_assigned"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '9 days' + interval '1 minute'),

('USER_ROLE_ASSIGNED', 'a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'module', 'pricing',
 '{"module_name": "Pricing & Promotions", "user_name": "Pranee Vendor", "assigned_by": "Admin User", "action": "module_assigned"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '9 days' + interval '2 minutes'),

-- Day 6: Failed login attempt
('FAILED_LOGIN', null, null, 'user', null,
 '{"email": "hacker@unknown.com", "reason": "invalid_credentials", "attempt_count": 3}',
 '45.33.32.156', 'Mozilla/5.0 (Linux) Chrome/119', now() - interval '8 days'),

-- Day 6: Supplier creates an item
('ITEM_CREATED', 'd1000000-0000-0000-0000-000000000001', null, 'item', 'NPD-2026-0001',
 '{"product_name_en": "Organic Green Tea 500ml", "product_name_th": "ชาเขียวออร์แกนิค 500มล.", "division": "food", "created_by": "Pranee Vendor", "supplier": "Fresh Produce Co"}',
 '10.0.0.55', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '7 days'),

('DOCUMENT_UPLOADED', 'd1000000-0000-0000-0000-000000000001', null, 'document', 'DOC-2026-0001',
 '{"file_name": "product_specification_green_tea.pdf", "file_size_kb": 2450, "item_id": "NPD-2026-0001", "product_name": "Organic Green Tea 500ml", "uploaded_by": "Pranee Vendor"}',
 '10.0.0.55', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '7 days' + interval '20 minutes'),

('ITEM_SUBMITTED', 'd1000000-0000-0000-0000-000000000001', null, 'item', 'NPD-2026-0001',
 '{"product_name": "Organic Green Tea 500ml", "submitted_by": "Pranee Vendor", "status": "pending_buyer", "supplier": "Fresh Produce Co"}',
 '10.0.0.55', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '7 days' + interval '30 minutes'),

-- Day 7: Buyer approves item
('USER_LOGIN', 'c1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'user', 'c1000000-0000-0000-0000-000000000001',
 '{"user_name": "Sarah Buyer", "role": "buyer", "department": "Procurement"}',
 '172.16.0.20', 'Mozilla/5.0 (Windows NT 10.0) Firefox/123', now() - interval '6 days'),

('ITEM_APPROVED', 'c1000000-0000-0000-0000-000000000001', null, 'item', 'NPD-2026-0001',
 '{"product_name": "Organic Green Tea 500ml", "approved_by": "Sarah Buyer", "approved_by_role": "buyer", "next_status": "pending_commercial"}',
 '172.16.0.20', 'Mozilla/5.0 (Windows NT 10.0) Firefox/123', now() - interval '6 days' + interval '2 hours'),

-- Day 8: Another item created and rejected
('ITEM_CREATED', 'b1000000-0000-0000-0000-000000000001', null, 'item', 'NPD-2026-0002',
 '{"product_name_en": "Spicy Instant Noodle Cup 75g", "product_name_th": "บะหมี่กึ่งสำเร็จรูปรสเผ็ด 75กรัม", "division": "food", "created_by": "Somchai Unilever", "supplier": "Unilever - Hardline"}',
 '203.150.44.22', 'Mozilla/5.0 (Macintosh) Safari/17.2', now() - interval '5 days'),

('ITEM_SUBMITTED', 'b1000000-0000-0000-0000-000000000001', null, 'item', 'NPD-2026-0002',
 '{"product_name": "Spicy Instant Noodle Cup 75g", "submitted_by": "Somchai Unilever", "status": "pending_buyer"}',
 '203.150.44.22', 'Mozilla/5.0 (Macintosh) Safari/17.2', now() - interval '5 days' + interval '45 minutes'),

('ITEM_REJECTED', 'c1000000-0000-0000-0000-000000000001', null, 'item', 'NPD-2026-0002',
 '{"product_name": "Spicy Instant Noodle Cup 75g", "rejected_by": "Sarah Buyer", "rejected_by_role": "buyer", "reason": "Missing nutritional information and barcode image"}',
 '172.16.0.20', 'Mozilla/5.0 (Windows NT 10.0) Firefox/123', now() - interval '4 days'),

-- Day 10: Item updated after rejection
('ITEM_UPDATED', 'b1000000-0000-0000-0000-000000000001', null, 'item', 'NPD-2026-0002',
 '{"product_name": "Spicy Instant Noodle Cup 75g", "updated_by": "Somchai Unilever", "fields_updated": ["nutritional_info", "barcode_image", "shelf_life"]}',
 '203.150.44.22', 'Mozilla/5.0 (Macintosh) Safari/17.2', now() - interval '3 days'),

-- Day 11: Admin deactivates a user
('USER_DEACTIVATED', 'a1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'user', 'e1000000-0000-0000-0000-000000000001',
 '{"user_name": "Wichai Supplier", "email": "wichai@nestle.com", "reason": "Contract with supplier ended", "deactivated_by": "Admin User"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '2 days'),

('SUPPLIER_USER_REMOVED', 'a1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'supplier', 'supplier-002',
 '{"supplier_name": "Global Foods Ltd", "supplier_code": "10002", "user_name": "Wichai Supplier", "removed_by": "Admin User", "reason": "User deactivated"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '2 days' + interval '1 minute'),

-- Day 12: Role change
('USER_ROLE_REMOVED', 'a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'user_role', 'buyer',
 '{"role": "buyer", "user_name": "Sarah Buyer", "removed_by": "Admin User", "reason": "Department transfer to Commercial"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '1 day'),

('USER_ROLE_ASSIGNED', 'a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'user_role', 'commercial',
 '{"role": "commercial", "user_name": "Sarah Buyer", "assigned_by": "Admin User", "reason": "Department transfer"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '1 day' + interval '1 minute'),

-- Day 13: Password reset request
('PASSWORD_RESET_REQUEST', 'd1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'user', 'd1000000-0000-0000-0000-000000000001',
 '{"user_name": "Pranee Vendor", "email": "pranee@cpfoods.co.th", "requested_via": "forgot_password_form"}',
 '10.0.0.55', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '12 hours'),

('PASSWORD_RESET_SUCCESS', 'd1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'user', 'd1000000-0000-0000-0000-000000000001',
 '{"user_name": "Pranee Vendor", "email": "pranee@cpfoods.co.th"}',
 '10.0.0.55', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '11 hours'),

-- Day 14: Today - Admin login and terms rejection
('USER_LOGIN', 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'user', 'a1000000-0000-0000-0000-000000000001',
 '{"user_name": "Admin User", "email": "admin@bigc.co.th", "role": "admin"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '2 hours'),

('TERMS_REJECTED', 'd1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'terms', 'v3.0',
 '{"version": "v3.0", "user_name": "Pranee Vendor", "document": "Updated Supplier Portal Terms & Conditions", "reason": "Disagree with new liability clause in Section 5"}',
 '10.0.0.55', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '30 minutes'),

-- Reactivation
('USER_ACTIVATED', 'a1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'user', 'e1000000-0000-0000-0000-000000000001',
 '{"user_name": "Wichai Supplier", "email": "wichai@nestle.com", "activated_by": "Admin User", "reason": "Contract renewed with Global Foods Ltd"}',
 '192.168.1.10', 'Mozilla/5.0 (Windows NT 10.0) Chrome/122', now() - interval '15 minutes');
