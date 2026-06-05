#!/usr/bin/env python3
"""
Complete End-to-End Authentication Test Script
Tests: Signup → Login → Database Save → Protected Routes
"""

import asyncio
import httpx
import json
from typing import Optional
from datetime import datetime

API_URL = "http://localhost:8000"
TEST_USER_EMAIL = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@artistkashi.com"
TEST_USER_PASSWORD = "TestPassword123!"
TEST_USER_DATA = {
    "email": TEST_USER_EMAIL,
    "password": TEST_USER_PASSWORD,
    "full_name": "Test User",
    "phone": "+1-555-0000",
    "role": "user",
}


class AuthTester:
    """Complete authentication flow tester"""

    def __init__(self, api_url: str = API_URL):
        self.api_url = api_url
        self.client = httpx.AsyncClient(base_url=api_url)
        self.access_token: str | None = None
        self.user_id: str | None = None

    async def close(self):
        """Close HTTP client"""
        await self.client.aclose()

    def print_success(self, message: str):
        """Print success message"""
        print(f"✅ {message}")

    def print_error(self, message: str):
        """Print error message"""
        print(f"❌ {message}")

    def print_info(self, message: str):
        """Print info message"""
        print(f"ℹ️  {message}")

    async def test_health(self) -> bool:
        """Test backend health"""
        print("\n=== 1️⃣ Testing Backend Health ===")
        try:
            response = await self.client.get("/health")
            if response.status_code == 200:
                self.print_success("Backend is running")
                return True
            else:
                self.print_error(f"Backend health check failed: {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Cannot connect to backend: {e}")
            return False

    async def test_auth_status(self) -> bool:
        """Test auth status endpoint"""
        print("\n=== 2️⃣ Testing Auth Status ===")
        try:
            response = await self.client.get("/test/auth-status")
            if response.status_code == 200:
                data = response.json()
                self.print_success(f"Auth system is ready")
                return True
            else:
                self.print_error(f"Auth status check failed: {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Auth status error: {e}")
            return False

    async def test_signup(self) -> bool:
        """Test user signup"""
        print(f"\n=== 3️⃣ Testing Signup ===")
        print(f"   Email: {TEST_USER_EMAIL}")
        try:
            response = await self.client.post(
                "/auth/register",
                json=TEST_USER_DATA,
            )

            if response.status_code in [200, 201]:
                data = response.json()
                self.user_id = data.get("id")
                self.print_success("User registered successfully")
                self.print_info(f"   User ID: {self.user_id}")
                self.print_info(f"   Email: {data.get('email')}")
                self.print_info(f"   Role: {data.get('role')}")
                self.print_info(f"   Full Name: {data.get('full_name')}")
                return True
            elif response.status_code == 400:
                error_data = response.json()
                self.print_error(f"Validation error: {error_data}")
                return False
            else:
                self.print_error(f"Registration failed: {response.status_code}")
                self.print_error(f"Response: {response.text}")
                return False
        except Exception as e:
            self.print_error(f"Signup error: {e}")
            return False

    async def test_login(self) -> bool:
        """Test user login"""
        print(f"\n=== 4️⃣ Testing Login ===")
        print(f"   Email: {TEST_USER_EMAIL}")
        try:
            data = {
                "username": TEST_USER_EMAIL,
                "password": TEST_USER_PASSWORD,
            }
            response = await self.client.post(
                "/auth/jwt/login",
                data=data,
            )

            if response.status_code == 200:
                response_data = response.json()
                self.access_token = response_data.get("access_token")
                token_type = response_data.get("token_type")
                self.print_success("Login successful")
                self.print_info(f"   Token Type: {token_type}")
                self.print_info(f"   Token (first 50 chars): {self.access_token[:50]}...")
                return True
            elif response.status_code == 401:
                self.print_error("Invalid credentials")
                return False
            else:
                self.print_error(f"Login failed: {response.status_code}")
                self.print_error(f"Response: {response.text}")
                return False
        except Exception as e:
            self.print_error(f"Login error: {e}")
            return False

    async def test_get_current_user(self) -> bool:
        """Test getting current user with token"""
        print(f"\n=== 5️⃣ Testing Get Current User (Protected Route) ===")
        if not self.access_token:
            self.print_error("No access token available")
            return False

        try:
            response = await self.client.get(
                "/users/me",
                headers={"Authorization": f"Bearer {self.access_token}"},
            )

            if response.status_code == 200:
                data = response.json()
                self.print_success("Retrieved current user info")
                self.print_info(f"   ID: {data.get('id')}")
                self.print_info(f"   Email: {data.get('email')}")
                self.print_info(f"   Full Name: {data.get('full_name')}")
                self.print_info(f"   Phone: {data.get('phone')}")
                self.print_info(f"   Role: {data.get('role')}")
                self.print_info(f"   Is Active: {data.get('is_active')}")
                self.print_info(f"   Is Verified: {data.get('is_verified')}")
                return True
            elif response.status_code == 401:
                self.print_error("Unauthorized - invalid token")
                return False
            else:
                self.print_error(f"Get current user failed: {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Get current user error: {e}")
            return False

    async def test_get_users_list(self) -> bool:
        """Test getting users list"""
        print(f"\n=== 6️⃣ Testing List All Users ===")
        try:
            response = await self.client.get("/users")

            if response.status_code == 200:
                data = response.json()
                # Handle both list and dict responses
                users = data if isinstance(data, list) else data.get("items", [])
                count = len(users)
                self.print_success(f"Retrieved users list ({count} users)")
                if count > 0:
                    self.print_info(f"   Sample user: {users[0].get('email')}")
                return True
            else:
                self.print_error(f"Get users list failed: {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Get users list error: {e}")
            return False

    async def test_unauthorized_access(self) -> bool:
        """Test that protected routes reject requests without token"""
        print(f"\n=== 7️⃣ Testing Unauthorized Access (Should Fail) ===")
        try:
            response = await self.client.get("/users/me")

            if response.status_code == 403:
                self.print_success("Protected route correctly rejected unauthorized request")
                return True
            else:
                self.print_error(f"Expected 403, got {response.status_code}")
                return False
        except Exception as e:
            self.print_error(f"Unauthorized access test error: {e}")
            return False

    async def run_all_tests(self) -> bool:
        """Run all tests"""
        print("=" * 60)
        print("🧪 COMPLETE AUTHENTICATION FLOW TEST")
        print("=" * 60)

        results = []

        # Test 1: Health
        results.append(("Backend Health", await self.test_health()))

        # Test 2: Auth Status
        results.append(("Auth Status", await self.test_auth_status()))

        # Test 3: Signup
        results.append(("User Signup", await self.test_signup()))

        # Test 4: Login
        results.append(("User Login", await self.test_login()))

        # Test 5: Get Current User (Protected)
        results.append(("Get Current User", await self.test_get_current_user()))

        # Test 6: Get Users List
        results.append(("List All Users", await self.test_get_users_list()))

        # Test 7: Unauthorized Access
        results.append(("Unauthorized Access", await self.test_unauthorized_access()))

        # Print results
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)

        passed = 0
        failed = 0

        for test_name, result in results:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status}: {test_name}")
            if result:
                passed += 1
            else:
                failed += 1

        print("=" * 60)
        print(f"Total: {passed} passed, {failed} failed")
        print("=" * 60)

        return failed == 0


async def main():
    """Main function"""
    tester = AuthTester()

    try:
        success = await tester.run_all_tests()

        if success:
            print("\n🎉 All tests passed! Authentication system is working correctly.")
        else:
            print("\n⚠️  Some tests failed. Check the errors above.")

    finally:
        await tester.close()


if __name__ == "__main__":
    asyncio.run(main())
