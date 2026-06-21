CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email varchar(320) NOT NULL UNIQUE,
    password_hash text NOT NULL,
    full_name varchar(160) NOT NULL,
    phone_number varchar(40),
    is_email_verified boolean NOT NULL DEFAULT false,
    is_active boolean NOT NULL DEFAULT true,
    deleted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL,
    modified_by uuid NULL
);

CREATE TABLE roles (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(80) NOT NULL UNIQUE,
    description varchar(240),
    deleted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL,
    modified_by uuid NULL
);

CREATE TABLE permissions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    code varchar(120) NOT NULL UNIQUE,
    description varchar(240) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
    user_id uuid NOT NULL REFERENCES users(id),
    role_id uuid NOT NULL REFERENCES roles(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_permissions (
    role_id uuid NOT NULL REFERENCES roles(id),
    permission_id uuid NOT NULL REFERENCES permissions(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE device_sessions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL REFERENCES users(id),
    refresh_token_hash text NOT NULL,
    device_name varchar(160),
    user_agent text,
    ip_address inet,
    expires_at timestamptz NOT NULL,
    revoked_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE customers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code varchar(40) NOT NULL UNIQUE,
    name varchar(180) NOT NULL,
    mobile_number varchar(40) NOT NULL,
    whatsapp_number varchar(40),
    cnic varchar(30),
    address text,
    city varchar(120),
    notes text,
    status varchar(30) NOT NULL DEFAULT 'Active',
    registered_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL REFERENCES users(id),
    modified_by uuid NULL REFERENCES users(id)
);

CREATE INDEX ix_customers_search ON customers USING gin ((name || ' ' || mobile_number || ' ' || coalesce(cnic, '')) gin_trgm_ops);

CREATE TABLE suppliers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_code varchar(40) NOT NULL UNIQUE,
    name varchar(180) NOT NULL,
    contact_number varchar(40) NOT NULL,
    whatsapp_number varchar(40),
    address text,
    city varchar(120),
    registered_at timestamptz NOT NULL DEFAULT now(),
    deleted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL REFERENCES users(id),
    modified_by uuid NULL REFERENCES users(id)
);

CREATE INDEX ix_suppliers_search ON suppliers USING gin ((name || ' ' || contact_number) gin_trgm_ops);

CREATE TABLE inventory_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku varchar(80) NOT NULL UNIQUE,
    name varchar(180) NOT NULL,
    category varchar(80) NOT NULL,
    unit varchar(30) NOT NULL DEFAULT 'piece',
    quantity_on_hand numeric(18, 3) NOT NULL DEFAULT 0,
    average_cost numeric(18, 2) NOT NULL DEFAULT 0,
    low_stock_threshold numeric(18, 3) NOT NULL DEFAULT 0,
    deleted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL REFERENCES users(id),
    modified_by uuid NULL REFERENCES users(id),
    CONSTRAINT ck_inventory_quantity_non_negative CHECK (quantity_on_hand >= 0),
    CONSTRAINT ck_inventory_average_cost_non_negative CHECK (average_cost >= 0)
);

CREATE TABLE purchases (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_number varchar(60) NOT NULL UNIQUE,
    supplier_id uuid NOT NULL REFERENCES suppliers(id),
    purchase_date timestamptz NOT NULL DEFAULT now(),
    subtotal numeric(18, 2) NOT NULL DEFAULT 0,
    discount numeric(18, 2) NOT NULL DEFAULT 0,
    total numeric(18, 2) NOT NULL DEFAULT 0,
    paid_amount numeric(18, 2) NOT NULL DEFAULT 0,
    balance_amount numeric(18, 2) NOT NULL DEFAULT 0,
    status varchar(30) NOT NULL DEFAULT 'open',
    notes text,
    deleted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL REFERENCES users(id),
    modified_by uuid NULL REFERENCES users(id)
);

CREATE TABLE purchase_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id uuid NOT NULL REFERENCES purchases(id),
    inventory_item_id uuid NOT NULL REFERENCES inventory_items(id),
    quantity numeric(18, 3) NOT NULL,
    unit_cost numeric(18, 2) NOT NULL,
    line_total numeric(18, 2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ck_purchase_item_quantity_positive CHECK (quantity > 0),
    CONSTRAINT ck_purchase_item_cost_non_negative CHECK (unit_cost >= 0)
);

CREATE TABLE pumps (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    pump_code varchar(60) NOT NULL UNIQUE,
    name varchar(180) NOT NULL,
    pump_type varchar(100) NOT NULL,
    customer_id uuid NULL REFERENCES customers(id),
    supplier_id uuid NULL REFERENCES suppliers(id),
    labor_cost numeric(18, 2) NOT NULL DEFAULT 0,
    material_cost numeric(18, 2) NOT NULL DEFAULT 0,
    sale_price numeric(18, 2) NOT NULL DEFAULT 0,
    status varchar(30) NOT NULL DEFAULT 'Pending',
    start_date date NOT NULL DEFAULT CURRENT_DATE,
    completion_date date,
    notes text,
    deleted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL REFERENCES users(id),
    modified_by uuid NULL REFERENCES users(id),
    CONSTRAINT ck_pump_status CHECK (status IN ('Pending', 'UnderWork', 'Ready', 'Delivered')),
    CONSTRAINT ck_pump_costs_non_negative CHECK (labor_cost >= 0 AND material_cost >= 0 AND sale_price >= 0)
);

CREATE TABLE pump_parts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    pump_id uuid NOT NULL REFERENCES pumps(id),
    inventory_item_id uuid NOT NULL REFERENCES inventory_items(id),
    quantity numeric(18, 3) NOT NULL,
    unit_cost numeric(18, 2) NOT NULL,
    line_total numeric(18, 2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ck_pump_part_quantity_positive CHECK (quantity > 0)
);

CREATE TABLE sales (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number varchar(60) NOT NULL UNIQUE,
    customer_id uuid NOT NULL REFERENCES customers(id),
    invoice_date timestamptz NOT NULL DEFAULT now(),
    subtotal numeric(18, 2) NOT NULL DEFAULT 0,
    discount numeric(18, 2) NOT NULL DEFAULT 0,
    total numeric(18, 2) NOT NULL DEFAULT 0,
    paid_amount numeric(18, 2) NOT NULL DEFAULT 0,
    balance_amount numeric(18, 2) NOT NULL DEFAULT 0,
    status varchar(30) NOT NULL DEFAULT 'open',
    notes text,
    deleted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL REFERENCES users(id),
    modified_by uuid NULL REFERENCES users(id),
    CONSTRAINT ck_sale_amounts_non_negative CHECK (subtotal >= 0 AND discount >= 0 AND total >= 0 AND paid_amount >= 0 AND balance_amount >= 0)
);

CREATE TABLE sale_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id uuid NOT NULL REFERENCES sales(id),
    pump_id uuid NULL REFERENCES pumps(id),
    description varchar(240) NOT NULL,
    quantity numeric(18, 3) NOT NULL DEFAULT 1,
    unit_price numeric(18, 2) NOT NULL,
    line_total numeric(18, 2) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number varchar(60) NOT NULL UNIQUE,
    customer_id uuid NULL REFERENCES customers(id),
    supplier_id uuid NULL REFERENCES suppliers(id),
    sale_id uuid NULL REFERENCES sales(id),
    purchase_id uuid NULL REFERENCES purchases(id),
    amount numeric(18, 2) NOT NULL,
    method varchar(40) NOT NULL,
    direction varchar(20) NOT NULL,
    paid_at timestamptz NOT NULL DEFAULT now(),
    notes text,
    deleted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL REFERENCES users(id),
    modified_by uuid NULL REFERENCES users(id),
    CONSTRAINT ck_payment_amount_positive CHECK (amount > 0),
    CONSTRAINT ck_payment_method CHECK (method IN ('Cash', 'BankTransfer', 'Easypaisa', 'JazzCash')),
    CONSTRAINT ck_payment_direction CHECK (direction IN ('Received', 'Paid'))
);

CREATE TABLE ledger_entries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid NULL REFERENCES customers(id),
    supplier_id uuid NULL REFERENCES suppliers(id),
    sale_id uuid NULL REFERENCES sales(id),
    purchase_id uuid NULL REFERENCES purchases(id),
    payment_id uuid NULL REFERENCES payments(id),
    entry_date timestamptz NOT NULL DEFAULT now(),
    debit numeric(18, 2) NOT NULL DEFAULT 0,
    credit numeric(18, 2) NOT NULL DEFAULT 0,
    balance_after numeric(18, 2) NOT NULL,
    source_type varchar(80) NOT NULL,
    source_id uuid NOT NULL,
    description varchar(300) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL REFERENCES users(id),
    CONSTRAINT ck_ledger_single_side CHECK ((debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0))
);

CREATE INDEX ix_ledger_customer_date ON ledger_entries(customer_id, entry_date DESC);
CREATE INDEX ix_ledger_supplier_date ON ledger_entries(supplier_id, entry_date DESC);

CREATE TABLE stock_transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_item_id uuid NOT NULL REFERENCES inventory_items(id),
    transaction_type varchar(40) NOT NULL,
    quantity numeric(18, 3) NOT NULL,
    unit_cost numeric(18, 2) NOT NULL DEFAULT 0,
    source_type varchar(80) NOT NULL,
    source_id uuid NULL,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL REFERENCES users(id),
    CONSTRAINT ck_stock_transaction_type CHECK (transaction_type IN ('stock_in', 'stock_out', 'adjustment', 'transfer', 'production_use'))
);

CREATE TABLE expenses (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_number varchar(60) NOT NULL UNIQUE,
    category varchar(100) NOT NULL,
    amount numeric(18, 2) NOT NULL,
    expense_date timestamptz NOT NULL DEFAULT now(),
    notes text,
    deleted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid NULL REFERENCES users(id),
    modified_by uuid NULL REFERENCES users(id)
);

CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NULL REFERENCES users(id),
    title varchar(160) NOT NULL,
    message text NOT NULL,
    notification_type varchar(80) NOT NULL,
    entity_type varchar(80),
    entity_id uuid,
    read_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE activity_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NULL REFERENCES users(id),
    action varchar(120) NOT NULL,
    entity_type varchar(120),
    entity_id uuid,
    ip_address inet,
    user_agent text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid NULL REFERENCES users(id),
    entity_type varchar(120) NOT NULL,
    entity_id uuid NOT NULL,
    action varchar(40) NOT NULL,
    old_values jsonb,
    new_values jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ix_audit_entity ON audit_logs(entity_type, entity_id, created_at DESC);
