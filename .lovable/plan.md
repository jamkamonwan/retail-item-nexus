
# Episode 1: Supplier Initial Product Registration (80 Fields)

## Overview

This plan implements the **Supplier Initial Product Registration** form - the first user story in the NPD workflow. A supplier fills out ~80 fields across 6 major sections to register a new product for buyer review.

---

## Field Architecture (80 Fields Total)

### Section 1: Product Identification (15 fields)

| # | Field ID | Field Name (EN) | Field Name (TH) | Type | Requirement |
|---|----------|-----------------|-----------------|------|-------------|
| 1 | barcode | Barcode/EAN | รหัสบาร์โค้ด | text | mandatory |
| 2 | product_name_th | Product Name (Thai) | ชื่อสินค้า (ไทย) | text | mandatory |
| 3 | product_name_en | Product Name (English) | ชื่อสินค้า (อังกฤษ) | text | mandatory |
| 4 | category | Category | หมวดหมู่สินค้า | dropdown | mandatory |
| 5 | sub_category | Sub-category | หมวดหมู่ย่อย | dropdown | mandatory |
| 6 | brand | Brand | แบรนด์ | text | mandatory |
| 7 | model | Model/SKU | รุ่น/รหัสสินค้า | text | optional |
| 8 | supplier_code | Supplier Item Code | รหัสสินค้าซัพพลายเออร์ | text | mandatory |
| 9 | supplier_name | Supplier Name | ชื่อซัพพลายเออร์ | text | readonly/auto |
| 10 | department | Department | แผนก | dropdown | mandatory |
| 11 | item_type | Item Type | ประเภทรายการ | dropdown | mandatory |
| 12 | product_type | Product Type | ประเภทสินค้า | dropdown | mandatory |
| 13 | sales_channel | Sales Channel | ช่องทางการขาย | dropdown | mandatory |
| 14 | season_code | Season Code | รหัสฤดูกาล | text | conditional |
| 15 | article_number | Article Number | เลขที่ Article | text | optional |

### Section 2: Product Images (7 fields)

| # | Field ID | Field Name (EN) | Field Name (TH) | Type | Requirement |
|---|----------|-----------------|-----------------|------|-------------|
| 16 | image_front | Front View | รูปด้านหน้า | file | mandatory |
| 17 | image_back | Back View | รูปด้านหลัง | file | mandatory |
| 18 | image_side | Side View | รูปด้านข้าง | file | optional |
| 19 | image_detail | Detail/Zoom | รูปรายละเอียด | file | optional |
| 20 | image_tisi | TISI Certificate | รูป มอก. | file | conditional |
| 21 | image_fda | FDA Registration | รูป อย. | file | conditional |
| 22 | image_size_chart | Size Chart | ตารางไซส์ | file | conditional |

### Section 3: Basic Attributes (20 fields)

| # | Field ID | Field Name (EN) | Field Name (TH) | Type | Requirement |
|---|----------|-----------------|-----------------|------|-------------|
| 23 | size | Size | ขนาด | text | mandatory |
| 24 | color | Color | สี | text | conditional |
| 25 | weight_net | Net Weight (g) | น้ำหนักสุทธิ (ก.) | number | mandatory |
| 26 | weight_gross | Gross Weight (g) | น้ำหนักรวม (ก.) | number | mandatory |
| 27 | dimension_l | Length (cm) | ความยาว (ซม.) | number | mandatory |
| 28 | dimension_w | Width (cm) | ความกว้าง (ซม.) | number | mandatory |
| 29 | dimension_h | Height (cm) | ความสูง (ซม.) | number | mandatory |
| 30 | material | Material | วัสดุ | text | conditional |
| 31 | country_origin | Country of Origin | ประเทศผู้ผลิต | dropdown | mandatory |
| 32 | manufacturer | Manufacturer | ผู้ผลิต | text | mandatory |
| 33 | pack_size | Pack Size | ขนาดบรรจุ | text | mandatory |
| 34 | pack_type | Pack Type | ประเภทบรรจุภัณฑ์ | dropdown | mandatory |
| 35 | shelf_life_days | Shelf Life (Days) | อายุสินค้า (วัน) | number | conditional |
| 36 | storage_condition | Storage Condition | สภาพการเก็บรักษา | dropdown | conditional |
| 37 | storage_temp | Storage Temperature | อุณหภูมิเก็บรักษา | dropdown | conditional |
| 38 | ingredients | Ingredients | ส่วนประกอบ | textarea | conditional |
| 39 | allergen_info | Allergen Information | ข้อมูลสารก่อภูมิแพ้ | textarea | conditional |
| 40 | nutrition_info | Nutrition Facts | ข้อมูลโภชนาการ | textarea | conditional |
| 41 | usage_instructions | Usage Instructions | วิธีใช้ | textarea | optional |
| 42 | warning_text | Warning/Caution | คำเตือน | textarea | conditional |

### Section 4: Compliance & Certification (10 fields)

| # | Field ID | Field Name (EN) | Field Name (TH) | Type | Requirement |
|---|----------|-----------------|-----------------|------|-------------|
| 43 | tisi_number | TISI Number | เลข มอก. | text | conditional |
| 44 | tisi_expiry | TISI Expiry Date | วันหมดอายุ มอก. | date | conditional |
| 45 | fda_number | FDA Number | เลข อย. | text | conditional |
| 46 | fda_expiry | FDA Expiry Date | วันหมดอายุ อย. | date | conditional |
| 47 | halal_cert | Halal Certification | การรับรองฮาลาล | dropdown | conditional |
| 48 | organic_cert | Organic Certification | การรับรองออร์แกนิค | dropdown | optional |
| 49 | iso_cert | ISO Certification | การรับรอง ISO | text | optional |
| 50 | other_cert | Other Certifications | การรับรองอื่นๆ | textarea | optional |
| 51 | product_license | Product License | ใบอนุญาตสินค้า | file | conditional |
| 52 | test_report | Test Report | รายงานการทดสอบ | file | optional |

### Section 5: Pricing Basics (8 fields)

| # | Field ID | Field Name (EN) | Field Name (TH) | Type | Requirement |
|---|----------|-----------------|-----------------|------|-------------|
| 53 | cost_price | Cost Price (excl. VAT) | ราคาทุน (ไม่รวม VAT) | number | mandatory |
| 54 | cost_price_vat | Cost Price (incl. VAT) | ราคาทุน (รวม VAT) | number | mandatory |
| 55 | srp | Suggested Retail Price | ราคาขายปลีกแนะนำ | number | mandatory |
| 56 | unit_measure | Unit of Measure | หน่วยวัด | dropdown | mandatory |
| 57 | qty_per_pack | Quantity per Pack | จำนวนต่อแพ็ค | number | mandatory |
| 58 | vat_type | VAT Type | ประเภท VAT | dropdown | mandatory |
| 59 | price_effective_date | Price Effective Date | วันที่ราคามีผล | date | optional |
| 60 | promo_remarks | Promotion Remarks | หมายเหตุโปรโมชั่น | textarea | optional |

### Section 6: Logistics & Supply Chain (20 fields)

| # | Field ID | Field Name (EN) | Field Name (TH) | Type | Requirement |
|---|----------|-----------------|-----------------|------|-------------|
| 61 | moq | Minimum Order Qty | จำนวนสั่งซื้อขั้นต่ำ | number | mandatory |
| 62 | lead_time_days | Lead Time (Days) | ระยะเวลาจัดส่ง (วัน) | number | mandatory |
| 63 | pack_per_layer | Packs per Layer | จำนวนต่อชั้น | number | mandatory |
| 64 | layer_per_pallet | Layers per Pallet | จำนวนชั้นต่อ Pallet | number | mandatory |
| 65 | pack_per_carton | Packs per Carton | จำนวนต่อลัง | number | mandatory |
| 66 | carton_dimension_l | Carton Length (cm) | ความยาวลัง (ซม.) | number | mandatory |
| 67 | carton_dimension_w | Carton Width (cm) | ความกว้างลัง (ซม.) | number | mandatory |
| 68 | carton_dimension_h | Carton Height (cm) | ความสูงลัง (ซม.) | number | mandatory |
| 69 | carton_weight | Carton Weight (kg) | น้ำหนักลัง (กก.) | number | mandatory |
| 70 | cbm_per_carton | CBM per Carton | ปริมาตรต่อลัง | number | calculated |
| 71 | delivery_point | Delivery Point | จุดส่งมอบ | dropdown | mandatory |
| 72 | incoterm | Incoterm | เงื่อนไขการส่งมอบ | dropdown | mandatory |
| 73 | dc_delivery | DC Delivery Method | วิธีจัดส่ง DC | dropdown | mandatory |
| 74 | cross_dock | Cross Dock Required | ต้องการ Cross Dock | dropdown | optional |
| 75 | return_policy | Return Policy | นโยบายคืนสินค้า | dropdown | mandatory |
| 76 | damage_allowance | Damage Allowance (%) | เปอร์เซ็นต์ความเสียหาย | number | optional |
| 77 | order_multiple | Order Multiple | จำนวนทวีคูณการสั่ง | number | mandatory |
| 78 | safety_stock_days | Safety Stock (Days) | สต็อกสำรอง (วัน) | number | optional |
| 79 | first_delivery_date | First Delivery Date | วันส่งมอบครั้งแรก | date | optional |
| 80 | supplier_remarks | Supplier Remarks | หมายเหตุซัพพลายเออร์ | textarea | optional |

---

## Division Mapping

Update departments to match user specification:

| Code | Full Name | Category |
|------|-----------|----------|
| HL | Hard Lines | Non-food |
| HOL | Home & Living | Non-food |
| DF | Dairy & Frozen | Food |
| NF | Non-Food | Non-food |
| SL | Soft Lines | Non-food |
| FF | Fresh Food | Food |
| PH | Pharmacy/Health | Health |

---

## Technical Implementation

### Files to Create

1. **`src/data/npd-fields-supplier.ts`**
   - All 80 supplier form fields with complete metadata
   - Field grouping by section
   - Conditional field logic (e.g., TISI required for certain categories)
   - Division-specific field visibility rules

### Files to Modify

1. **`src/types/npd.ts`**
   - Update Division type to include `HOL`, `NF`, `PH`
   - Add new FormSection types for the 6 supplier sections
   - Add category/sub-category dropdown data

2. **`src/data/npd-fields.ts`**
   - Replace existing fields with the new 80-field structure
   - Update helper functions for new sections

3. **`src/components/npd/NPDForm.tsx`**
   - Update form steps to match 6 sections
   - Add calculated field logic (e.g., CBM calculation)
   - Add conditional field visibility
   - Improve auto-fill for testing

4. **`src/components/npd/FormSection.tsx`**
   - Group fields by requirement type (mandatory/conditional/optional)
   - Add section-level completion indicator

5. **`src/components/npd/FormField.tsx`**
   - Add readonly field type for auto-populated fields
   - Add file upload preview for images

6. **`src/data/mock/submissions.ts`**
   - Update mock data to include all 80 fields
   - Add realistic sample values

---

## UI/UX Design

### Form Layout

```
text
+--------------------------------------------------+
|  ← Back to Dashboard                              |
|                                                   |
|  New Product Registration                         |
|  [Progress: ████████░░░░░░░░] 45% (Section 3/6)  |
|                                                   |
|  ┌─────────────────────────────────────────────┐ |
|  │ Sections                      │  Form Area  │ |
|  │ ──────────────────────────── │             │ |
|  │ ✓ Product Identification     │  [Fields]   │ |
|  │ ✓ Product Images             │             │ |
|  │ ● Basic Attributes ← current │             │ |
|  │ ○ Compliance                 │             │ |
|  │ ○ Pricing                    │             │ |
|  │ ○ Logistics                  │             │ |
|  └─────────────────────────────────────────────┘ |
|                                                   |
|  [Auto-Fill Demo]  [Save Draft]  [← Prev] [Next→]|
+--------------------------------------------------+
```

### Field Indicators

- `*` Red asterisk = Mandatory field
- `◇` Diamond = Conditional (shown based on selections)
- No marker = Optional field
- Gray/locked = Readonly/Auto-populated

### Image Upload Preview

For the 7 image fields, show:
- Thumbnail preview after upload
- File name and size
- Remove button
- Drag-and-drop support

---

## Conditional Field Logic

| Condition | Fields Shown |
|-----------|--------------|
| Division = DF, FF | shelf_life_days, storage_temp, ingredients, allergen_info, nutrition_info |
| Division = SL | color, size, image_size_chart |
| Division = PH | fda_number, fda_expiry, image_fda, warning_text |
| Category requires TISI | tisi_number, tisi_expiry, image_tisi |
| Halal required | halal_cert |

---

## Mock Data Updates

Update mock submissions with realistic 80-field data:

```typescript
{
  id: 'sub-001',
  division: 'DF',
  productNameTh: 'น้ำส้มคั้นสด 100%',
  productNameEn: 'Fresh Orange Juice 100%',
  barcode: '8851234567890',
  formData: {
    // Product Identification
    category: 'Beverages',
    sub_category: 'Juice',
    brand: 'ACME Fresh',
    supplier_code: 'ACM-OJ-001',
    department: 'DF',
    // Basic Attributes
    size: '1000ml',
    weight_net: 1050,
    dimension_l: 8,
    dimension_w: 8,
    dimension_h: 26,
    shelf_life_days: 30,
    storage_temp: 'chill',
    // Pricing
    cost_price: 35.00,
    srp: 55.00,
    // Logistics
    moq: 100,
    lead_time_days: 3,
    pack_per_carton: 12,
    // ... all 80 fields
  }
}
```

---

## Benefits

1. **Complete supplier data capture** - All 80 fields needed for product registration
2. **Division-aware forms** - Fields adapt to product type (food vs non-food)
3. **Clear field requirements** - Visual indicators for mandatory/conditional/optional
4. **Efficient testing** - Auto-fill generates realistic dummy data for all fields
5. **Mock-first development** - UI works without database, ready for user feedback

---

## Next Steps After Implementation

- Verify form displays all 80 fields correctly
- Test conditional field logic by switching divisions
- Use auto-fill to populate form with dummy data
- Review mock submissions in the Supplier Dashboard
