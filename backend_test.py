#!/usr/bin/env python3
"""
Backend API Test Suite for SatvaRoot Exports
Tests all endpoints as specified in the review request
"""

import requests
import json
import sys

BASE_URL = "https://d4060771-a6b1-410e-a50e-864a5cc70d8f.preview.emergentagent.com/api"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "satvaroot2025"

# Global variables to store test data
admin_token = None
test_product_id = None
test_enquiry_id = None

def log_test(test_name, passed, details=""):
    """Log test results"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"\n{status}: {test_name}")
    if details:
        print(f"  Details: {details}")
    return passed

def test_health():
    """Test 1: Health endpoint GET /api"""
    print("\n" + "="*80)
    print("TEST 1: Health Endpoint")
    print("="*80)
    
    try:
        response = requests.get(BASE_URL, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            data.get('status') == 'ok' and
            data.get('service') == 'SatvaRoot Exports API'
        )
        
        return log_test(
            "Health endpoint",
            passed,
            f"Status: {response.status_code}, Response: {data}"
        )
    except Exception as e:
        return log_test("Health endpoint", False, f"Exception: {str(e)}")

def test_auto_seed_products():
    """Test 2: Auto-seed products"""
    print("\n" + "="*80)
    print("TEST 2: Auto-seed Products")
    print("="*80)
    
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        data = response.json()
        
        products = data.get('products', [])
        passed = response.status_code == 200 and len(products) >= 12
        
        if passed and len(products) > 0:
            # Verify product shape
            sample = products[0]
            required_fields = ['id', 'name', 'slug', 'category', 'images', 'description', 
                             'moq', 'packaging', 'weight', 'shelfLife', 'grade', 
                             'countries', 'certifications', 'hsCode', 'nutrition', 'featured']
            missing_fields = [f for f in required_fields if f not in sample]
            
            if missing_fields:
                passed = False
                details = f"Missing fields in product: {missing_fields}"
            else:
                details = f"Found {len(products)} products with all required fields"
        else:
            details = f"Status: {response.status_code}, Products count: {len(products)}"
        
        return log_test("Auto-seed products", passed, details)
    except Exception as e:
        return log_test("Auto-seed products", False, f"Exception: {str(e)}")

def test_product_filters():
    """Test 3: Product filters"""
    print("\n" + "="*80)
    print("TEST 3: Product Filters")
    print("="*80)
    
    all_passed = True
    
    # Test category filter
    try:
        response = requests.get(f"{BASE_URL}/products?category=Turmeric%20Powder", timeout=10)
        data = response.json()
        products = data.get('products', [])
        
        category_passed = (
            response.status_code == 200 and
            all(p.get('category') == 'Turmeric Powder' for p in products)
        )
        
        log_test(
            "Category filter (Turmeric Powder)",
            category_passed,
            f"Found {len(products)} products in category"
        )
        all_passed = all_passed and category_passed
    except Exception as e:
        log_test("Category filter", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Test featured filter
    try:
        response = requests.get(f"{BASE_URL}/products?featured=true", timeout=10)
        data = response.json()
        products = data.get('products', [])
        
        featured_passed = (
            response.status_code == 200 and
            all(p.get('featured') == True for p in products)
        )
        
        log_test(
            "Featured filter",
            featured_passed,
            f"Found {len(products)} featured products"
        )
        all_passed = all_passed and featured_passed
    except Exception as e:
        log_test("Featured filter", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Test search query
    try:
        response = requests.get(f"{BASE_URL}/products?q=turmeric", timeout=10)
        data = response.json()
        products = data.get('products', [])
        
        search_passed = (
            response.status_code == 200 and
            len(products) > 0 and
            any('turmeric' in p.get('name', '').lower() or 
                'turmeric' in p.get('description', '').lower() or
                'turmeric' in p.get('category', '').lower() 
                for p in products)
        )
        
        log_test(
            "Search query (turmeric)",
            search_passed,
            f"Found {len(products)} products matching search"
        )
        all_passed = all_passed and search_passed
    except Exception as e:
        log_test("Search query", False, f"Exception: {str(e)}")
        all_passed = False
    
    return all_passed

def test_single_product():
    """Test 4: Single product by ID"""
    print("\n" + "="*80)
    print("TEST 4: Single Product by ID")
    print("="*80)
    
    all_passed = True
    
    # First get a product ID
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        data = response.json()
        products = data.get('products', [])
        
        if len(products) == 0:
            return log_test("Single product", False, "No products available to test")
        
        product_id = products[0]['id']
        
        # Test valid product ID
        response = requests.get(f"{BASE_URL}/products/{product_id}", timeout=10)
        data = response.json()
        
        valid_passed = (
            response.status_code == 200 and
            'product' in data and
            data['product']['id'] == product_id
        )
        
        log_test(
            "Get product by valid ID",
            valid_passed,
            f"Retrieved product: {data.get('product', {}).get('name', 'N/A')}"
        )
        all_passed = all_passed and valid_passed
        
        # Test invalid product ID
        response = requests.get(f"{BASE_URL}/products/nonexistent-id-12345", timeout=10)
        
        invalid_passed = response.status_code == 404
        
        log_test(
            "Get product by invalid ID (expect 404)",
            invalid_passed,
            f"Status: {response.status_code}"
        )
        all_passed = all_passed and invalid_passed
        
    except Exception as e:
        log_test("Single product", False, f"Exception: {str(e)}")
        all_passed = False
    
    return all_passed

def test_admin_authentication():
    """Test 5: Admin authentication"""
    print("\n" + "="*80)
    print("TEST 5: Admin Authentication")
    print("="*80)
    
    global admin_token
    all_passed = True
    
    # Test valid login
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
            timeout=10
        )
        data = response.json()
        
        login_passed = (
            response.status_code == 200 and
            'token' in data
        )
        
        if login_passed:
            admin_token = data['token']
        
        log_test(
            "Admin login with valid credentials",
            login_passed,
            f"Status: {response.status_code}, Token received: {bool(admin_token)}"
        )
        all_passed = all_passed and login_passed
    except Exception as e:
        log_test("Admin login", False, f"Exception: {str(e)}")
        all_passed = False
        return False
    
    # Test invalid login
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": ADMIN_USERNAME, "password": "wrong_password"},
            timeout=10
        )
        
        invalid_login_passed = response.status_code == 401
        
        log_test(
            "Admin login with invalid credentials (expect 401)",
            invalid_login_passed,
            f"Status: {response.status_code}"
        )
        all_passed = all_passed and invalid_login_passed
    except Exception as e:
        log_test("Invalid login", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Test verify with valid token
    try:
        response = requests.get(
            f"{BASE_URL}/admin/verify",
            headers={"Authorization": f"Bearer {admin_token}"},
            timeout=10
        )
        data = response.json()
        
        verify_passed = (
            response.status_code == 200 and
            data.get('valid') == True
        )
        
        log_test(
            "Verify with valid token",
            verify_passed,
            f"Status: {response.status_code}, Valid: {data.get('valid')}"
        )
        all_passed = all_passed and verify_passed
    except Exception as e:
        log_test("Verify with token", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Test verify without token
    try:
        response = requests.get(f"{BASE_URL}/admin/verify", timeout=10)
        data = response.json()
        
        no_token_passed = (
            response.status_code == 200 and
            data.get('valid') == False
        )
        
        log_test(
            "Verify without token (expect valid:false)",
            no_token_passed,
            f"Status: {response.status_code}, Valid: {data.get('valid')}"
        )
        all_passed = all_passed and no_token_passed
    except Exception as e:
        log_test("Verify without token", False, f"Exception: {str(e)}")
        all_passed = False
    
    return all_passed

def test_admin_logout():
    """Test logout functionality"""
    print("\n" + "="*80)
    print("TEST 5b: Admin Logout")
    print("="*80)
    
    global admin_token
    
    # First login to get a fresh token
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
            timeout=10
        )
        data = response.json()
        logout_token = data.get('token')
        
        # Logout
        response = requests.post(
            f"{BASE_URL}/admin/logout",
            headers={"Authorization": f"Bearer {logout_token}"},
            timeout=10
        )
        
        logout_passed = response.status_code == 200
        
        # Verify token is now invalid
        response = requests.get(
            f"{BASE_URL}/admin/verify",
            headers={"Authorization": f"Bearer {logout_token}"},
            timeout=10
        )
        data = response.json()
        
        verify_invalid = data.get('valid') == False
        
        passed = logout_passed and verify_invalid
        
        return log_test(
            "Admin logout and token invalidation",
            passed,
            f"Logout status: {logout_passed}, Token invalid after logout: {verify_invalid}"
        )
    except Exception as e:
        return log_test("Admin logout", False, f"Exception: {str(e)}")

def test_protected_endpoints():
    """Test 6: Protected endpoints without auth"""
    print("\n" + "="*80)
    print("TEST 6: Protected Endpoints (No Auth = 401)")
    print("="*80)
    
    all_passed = True
    
    endpoints = [
        ("POST", "/products", {"name": "Test"}),
        ("PUT", "/products/test-id", {"description": "Test"}),
        ("DELETE", "/products/test-id", None),
        ("GET", "/enquiries", None),
        ("GET", "/admin/stats", None),
    ]
    
    for method, path, body in endpoints:
        try:
            if method == "POST":
                response = requests.post(f"{BASE_URL}{path}", json=body, timeout=10)
            elif method == "PUT":
                response = requests.put(f"{BASE_URL}{path}", json=body, timeout=10)
            elif method == "DELETE":
                response = requests.delete(f"{BASE_URL}{path}", timeout=10)
            else:  # GET
                response = requests.get(f"{BASE_URL}{path}", timeout=10)
            
            passed = response.status_code == 401
            
            log_test(
                f"{method} {path} without auth (expect 401)",
                passed,
                f"Status: {response.status_code}"
            )
            all_passed = all_passed and passed
        except Exception as e:
            log_test(f"{method} {path}", False, f"Exception: {str(e)}")
            all_passed = False
    
    return all_passed

def test_product_crud_with_auth():
    """Test 7: Product CRUD with authentication"""
    print("\n" + "="*80)
    print("TEST 7: Product CRUD with Authentication")
    print("="*80)
    
    global admin_token, test_product_id
    all_passed = True
    
    # Ensure we have a valid token
    if not admin_token:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD},
            timeout=10
        )
        admin_token = response.json().get('token')
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # CREATE product
    try:
        new_product = {
            "name": "Test Cardamom Premium",
            "category": "Spices",
            "description": "Test product for API validation"
        }
        
        response = requests.post(
            f"{BASE_URL}/products",
            json=new_product,
            headers=headers,
            timeout=10
        )
        data = response.json()
        
        create_passed = (
            response.status_code in [200, 201] and
            'product' in data and
            'id' in data['product']
        )
        
        if create_passed:
            test_product_id = data['product']['id']
        
        log_test(
            "Create product (POST /products)",
            create_passed,
            f"Status: {response.status_code}, Product ID: {test_product_id}"
        )
        all_passed = all_passed and create_passed
    except Exception as e:
        log_test("Create product", False, f"Exception: {str(e)}")
        all_passed = False
        return False
    
    # UPDATE product
    try:
        update_data = {"description": "Updated test description"}
        
        response = requests.put(
            f"{BASE_URL}/products/{test_product_id}",
            json=update_data,
            headers=headers,
            timeout=10
        )
        data = response.json()
        
        update_passed = (
            response.status_code == 200 and
            'product' in data and
            data['product'].get('description') == "Updated test description"
        )
        
        log_test(
            "Update product (PUT /products/:id)",
            update_passed,
            f"Status: {response.status_code}, Description updated: {update_passed}"
        )
        all_passed = all_passed and update_passed
    except Exception as e:
        log_test("Update product", False, f"Exception: {str(e)}")
        all_passed = False
    
    # DELETE product
    try:
        response = requests.delete(
            f"{BASE_URL}/products/{test_product_id}",
            headers=headers,
            timeout=10
        )
        data = response.json()
        
        delete_passed = (
            response.status_code == 200 and
            data.get('ok') == True
        )
        
        log_test(
            "Delete product (DELETE /products/:id)",
            delete_passed,
            f"Status: {response.status_code}, OK: {data.get('ok')}"
        )
        all_passed = all_passed and delete_passed
    except Exception as e:
        log_test("Delete product", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Verify product is deleted (404)
    try:
        response = requests.get(f"{BASE_URL}/products/{test_product_id}", timeout=10)
        
        verify_deleted = response.status_code == 404
        
        log_test(
            "Verify product deleted (expect 404)",
            verify_deleted,
            f"Status: {response.status_code}"
        )
        all_passed = all_passed and verify_deleted
    except Exception as e:
        log_test("Verify deleted", False, f"Exception: {str(e)}")
        all_passed = False
    
    return all_passed

def test_buyer_enquiries():
    """Test 8: Buyer enquiries"""
    print("\n" + "="*80)
    print("TEST 8: Buyer Enquiries")
    print("="*80)
    
    global admin_token, test_enquiry_id
    all_passed = True
    
    # CREATE enquiry (no auth required)
    try:
        enquiry_data = {
            "name": "Rajesh Kumar",
            "email": "rajesh@importco.com",
            "company": "Import Co Ltd",
            "country": "United States",
            "product": "Premium Turmeric Powder",
            "quantity": "500kg",
            "message": "Interested in bulk order for US market"
        }
        
        response = requests.post(
            f"{BASE_URL}/enquiries",
            json=enquiry_data,
            timeout=10
        )
        data = response.json()
        
        create_passed = (
            response.status_code == 200 and
            data.get('ok') == True and
            'enquiry' in data and
            'id' in data['enquiry']
        )
        
        if create_passed:
            test_enquiry_id = data['enquiry']['id']
        
        log_test(
            "Create enquiry (POST /enquiries)",
            create_passed,
            f"Status: {response.status_code}, Enquiry ID: {test_enquiry_id}"
        )
        all_passed = all_passed and create_passed
    except Exception as e:
        log_test("Create enquiry", False, f"Exception: {str(e)}")
        all_passed = False
        return False
    
    # Test missing required field
    try:
        response = requests.post(
            f"{BASE_URL}/enquiries",
            json={"email": "test@test.com"},  # missing name
            timeout=10
        )
        
        validation_passed = response.status_code == 400
        
        log_test(
            "Create enquiry with missing name (expect 400)",
            validation_passed,
            f"Status: {response.status_code}"
        )
        all_passed = all_passed and validation_passed
    except Exception as e:
        log_test("Enquiry validation", False, f"Exception: {str(e)}")
        all_passed = False
    
    # GET enquiries (requires admin)
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/enquiries", headers=headers, timeout=10)
        data = response.json()
        
        enquiries = data.get('enquiries', [])
        found_enquiry = any(e.get('id') == test_enquiry_id for e in enquiries)
        
        get_passed = (
            response.status_code == 200 and
            found_enquiry
        )
        
        log_test(
            "Get enquiries with admin token",
            get_passed,
            f"Status: {response.status_code}, Found test enquiry: {found_enquiry}"
        )
        all_passed = all_passed and get_passed
    except Exception as e:
        log_test("Get enquiries", False, f"Exception: {str(e)}")
        all_passed = False
    
    # UPDATE enquiry status
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.put(
            f"{BASE_URL}/enquiries/{test_enquiry_id}",
            json={"status": "contacted"},
            headers=headers,
            timeout=10
        )
        data = response.json()
        
        update_passed = (
            response.status_code == 200 and
            data.get('ok') == True
        )
        
        # Verify status was updated
        response = requests.get(f"{BASE_URL}/enquiries", headers=headers, timeout=10)
        data = response.json()
        enquiries = data.get('enquiries', [])
        updated_enquiry = next((e for e in enquiries if e.get('id') == test_enquiry_id), None)
        
        status_updated = updated_enquiry and updated_enquiry.get('status') == 'contacted'
        
        log_test(
            "Update enquiry status",
            update_passed and status_updated,
            f"Update status: {response.status_code}, Status changed to 'contacted': {status_updated}"
        )
        all_passed = all_passed and update_passed and status_updated
    except Exception as e:
        log_test("Update enquiry", False, f"Exception: {str(e)}")
        all_passed = False
    
    # DELETE enquiry
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.delete(
            f"{BASE_URL}/enquiries/{test_enquiry_id}",
            headers=headers,
            timeout=10
        )
        data = response.json()
        
        delete_passed = (
            response.status_code == 200 and
            data.get('ok') == True
        )
        
        log_test(
            "Delete enquiry",
            delete_passed,
            f"Status: {response.status_code}, OK: {data.get('ok')}"
        )
        all_passed = all_passed and delete_passed
    except Exception as e:
        log_test("Delete enquiry", False, f"Exception: {str(e)}")
        all_passed = False
    
    return all_passed

def test_newsletter():
    """Test 9: Newsletter subscription"""
    print("\n" + "="*80)
    print("TEST 9: Newsletter Subscription")
    print("="*80)
    
    all_passed = True
    
    # Subscribe with valid email
    try:
        response = requests.post(
            f"{BASE_URL}/newsletter",
            json={"email": "subscriber@example.com"},
            timeout=10
        )
        data = response.json()
        
        subscribe_passed = (
            response.status_code == 200 and
            data.get('ok') == True
        )
        
        log_test(
            "Newsletter subscribe",
            subscribe_passed,
            f"Status: {response.status_code}, OK: {data.get('ok')}"
        )
        all_passed = all_passed and subscribe_passed
    except Exception as e:
        log_test("Newsletter subscribe", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Subscribe again with same email (upsert, no error)
    try:
        response = requests.post(
            f"{BASE_URL}/newsletter",
            json={"email": "subscriber@example.com"},
            timeout=10
        )
        data = response.json()
        
        upsert_passed = (
            response.status_code == 200 and
            data.get('ok') == True
        )
        
        log_test(
            "Newsletter subscribe duplicate (upsert)",
            upsert_passed,
            f"Status: {response.status_code}, OK: {data.get('ok')}"
        )
        all_passed = all_passed and upsert_passed
    except Exception as e:
        log_test("Newsletter upsert", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Subscribe without email
    try:
        response = requests.post(
            f"{BASE_URL}/newsletter",
            json={},
            timeout=10
        )
        
        validation_passed = response.status_code == 400
        
        log_test(
            "Newsletter without email (expect 400)",
            validation_passed,
            f"Status: {response.status_code}"
        )
        all_passed = all_passed and validation_passed
    except Exception as e:
        log_test("Newsletter validation", False, f"Exception: {str(e)}")
        all_passed = False
    
    return all_passed

def test_admin_stats():
    """Test 10: Admin stats"""
    print("\n" + "="*80)
    print("TEST 10: Admin Stats")
    print("="*80)
    
    global admin_token
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
        data = response.json()
        
        passed = (
            response.status_code == 200 and
            'products' in data and
            'enquiries' in data and
            'newsletter' in data and
            'byStatus' in data
        )
        
        return log_test(
            "Admin stats",
            passed,
            f"Status: {response.status_code}, Stats: products={data.get('products')}, enquiries={data.get('enquiries')}, newsletter={data.get('newsletter')}"
        )
    except Exception as e:
        return log_test("Admin stats", False, f"Exception: {str(e)}")

def main():
    """Run all tests"""
    print("\n" + "="*80)
    print("SATVAROOT EXPORTS BACKEND API TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Admin: {ADMIN_USERNAME}")
    print("="*80)
    
    results = []
    
    # Run all tests in order
    results.append(("Health endpoint", test_health()))
    results.append(("Auto-seed products", test_auto_seed_products()))
    results.append(("Product filters", test_product_filters()))
    results.append(("Single product", test_single_product()))
    results.append(("Admin authentication", test_admin_authentication()))
    results.append(("Admin logout", test_admin_logout()))
    results.append(("Protected endpoints", test_protected_endpoints()))
    results.append(("Product CRUD with auth", test_product_crud_with_auth()))
    results.append(("Buyer enquiries", test_buyer_enquiries()))
    results.append(("Newsletter", test_newsletter()))
    results.append(("Admin stats", test_admin_stats()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print("\n" + "="*80)
    print(f"TOTAL: {passed_count}/{total_count} tests passed")
    print("="*80)
    
    # Exit with appropriate code
    sys.exit(0 if passed_count == total_count else 1)

if __name__ == "__main__":
    main()
