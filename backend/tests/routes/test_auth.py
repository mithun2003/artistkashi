#!/usr/bin/env python3
"""
Authentication testing script for ArtistKashi backend.

This script tests the complete authentication flow:
1. Register a new user
2. Login and get JWT token
3. Get current user info with token
4. Verify user exists in database
"""

import asyncio
import httpx
import json
from typing import Optional

# Configuration
API_URL = "http://localhost:8000"
TEST_EMAIL = "test@artistkashi.com"
TEST_PASSWORD = "TestPassword123!"
TEST_USER_DATA = {
    "email": TEST_EMAIL,
    "password": TEST_PASSWORD,
    "full_name": "ArtistKashi Test User",
    "phone": "+1234567890",
    "role": "user",
}


class AuthTester:
    """Test authentication flow."""

    def __init__(self, api_url: str = API_URL):
        self.api_url = api_url
        self.client = httpx.AsyncClient(base_url=api_url)
        self.access_token: Optional[str] = None
        self.user_id: Optional[str] = None

    async def close(self):
        """Close HTTP client."""
        await self.client.aclose()

    async def test_health(self) -> bool:
        """Test if backend is healthy."""
        print("\n🔍 Testing health check...")
        try:
            response = await self.client.get("/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Backend is healthy: {data.get('status')}")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False

    async def test_auth_status(self) -> bool:
        """Test auth status endpoint."""
        print("\n🔍 Testing auth status...")
        try:
            response = await self.client.get("/test/auth-status")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Auth status: {data.get('status')}")
                print(f"   Available endpoints: {len(data.get('endpoints', {}))}")
                return True
            else:
                print(f"❌ Auth status failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Auth status error: {e}")
            return False

    async def test_register(self) -> bool:
        """Register a new user."""
        print(f"\n👤 Registering user: {TEST_EMAIL}...")
        try:
            response = await self.client.post(
                "/auth/register",
                json=TEST_USER_DATA,
            )

            if response.status_code in [200, 201]:
                data = response.json()
                self.user_id = data.get("id")
                print(f"✅ Registration successful!")
                print(f"   User ID: {self.user_id}")
                print(f"   Email: {data.get('email')}")
                print(f"   Is Active: {data.get('is_active')}")
                print(f"   Is Verified: {data.get('is_verified')}")
                return True
            elif response.status_code == 400:
                error_data = response.json()
                if "REGISTER_INVALID_PASSWORD" in str(error_data):
                    print(f"⚠️  User already exists (trying to register again)")
                    # Try to login instead
                    return await self.test_login()
                else:
                    print(f"❌ Registration failed: {error_data}")
                    return False
            else:
                print(f"❌ Registration failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Registration error: {e}")
            return False

    async def test_login(self) -> bool:
        """Login and get JWT token."""
        print(f"\n🔐 Logging in as: {TEST_EMAIL}...")
        try:
            # Login uses form data, not JSON
            response = await self.client.post(
                "/auth/jwt/login",
                data={
                    "username": TEST_EMAIL,
                    "password": TEST_PASSWORD,
                },
            )

            if response.status_code == 200:
                data = response.json()
                self.access_token = data.get("access_token")
                token_type = data.get("token_type")
                print(f"✅ Login successful!")
                print(f"   Token Type: {token_type}")
                print(f"   Token: {self.access_token[:50]}...")
                return True
            else:
                print(f"❌ Login failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Login error: {e}")
            return False

    async def test_get_current_user(self) -> bool:
        """Get current user info with token."""
        if not self.access_token:
            print("❌ No token available. Please login first.")
            return False

        print(f"\n👥 Getting current user info...")
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = await self.client.get("/test/me", headers=headers)

            if response.status_code == 200:
                data = response.json()
                print(f"✅ Got current user info!")
                print(f"   ID: {data.get('id')}")
                print(f"   Email: {data.get('email')}")
                print(f"   Full Name: {data.get('full_name')}")
                print(f"   Phone: {data.get('phone')}")
                print(f"   Role: {data.get('role')}")
                print(f"   Is Active: {data.get('is_active')}")
                print(f"   Is Verified: {data.get('is_verified')}")
                self.user_id = data.get('id')
                return True
            else:
                print(f"❌ Failed to get user info: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Error getting user info: {e}")
            return False

    async def test_get_all_users(self) -> bool:
        """Get list of all users."""
        print(f"\n📋 Getting all users...")
        try:
            response = await self.client.get("/users")

            if response.status_code == 200:
                data = response.json()
                # data could be list or dict with 'items' key
                users = data if isinstance(data, list) else data.get("items", [])
                print(f"✅ Got users list!")
                print(f"   Total users: {len(users)}")
                for user in users[:5]:  # Show first 5
                    print(f"   - {user.get('email')} (ID: {user.get('id')})")
                if len(users) > 5:
                    print(f"   ... and {len(users) - 5} more")
                return True
            else:
                print(f"❌ Failed to get users: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Error getting users: {e}")
            return False

    async def run_all_tests(self) -> bool:
        """Run all tests in sequence."""
        print("\n" + "=" * 60)
        print("🚀 ArtistKashi Authentication Testing")
        print("=" * 60)

        tests = [
            ("Health Check", self.test_health),
            ("Auth Status", self.test_auth_status),
            ("Register User", self.test_register),
            ("Login", self.test_login),
            ("Get Current User", self.test_get_current_user),
            ("Get All Users", self.test_get_all_users),
        ]

        results = {}
        for test_name, test_func in tests:
            try:
                results[test_name] = await test_func()
            except Exception as e:
                print(f"❌ Test '{test_name}' failed with exception: {e}")
                results[test_name] = False

        # Summary
        print("\n" + "=" * 60)
        print("📊 Test Summary")
        print("=" * 60)

        passed = sum(1 for v in results.values() if v)
        total = len(results)

        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"{status} - {test_name}")

        print(f"\nTotal: {passed}/{total} tests passed")
        print("=" * 60)

        return passed == total


async def main():
    """Main test function."""
    tester = AuthTester()

    try:
        success = await tester.run_all_tests()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⏸️  Testing interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        exit(1)
    finally:
        await tester.close()


if __name__ == "__main__":
    asyncio.run(main())
