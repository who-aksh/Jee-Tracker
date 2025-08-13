#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for JEE Tracker
Tests all core API endpoints including authentication, user management, and syllabus tracking.
"""

import requests
import json
import sys
import os
from datetime import datetime

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        return "https://jeeprephub.preview.emergentagent.com"
    return "https://jeeprephub.preview.emergentagent.com"

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

class JEETrackerAPITest:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.user_id = None
        self.test_results = []
        
        # Test user data
        self.test_user = {
            "email": "arjun.sharma@example.com",
            "password": "SecurePass123!",
            "name": "Arjun Sharma"
        }
        
        print(f"🚀 Starting JEE Tracker API Tests")
        print(f"📍 Backend URL: {BASE_URL}")
        print(f"📍 API Base: {API_BASE}")
        print("=" * 60)

    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        })
        
        if not success:
            print(f"   📋 Details: {response_data}")

    def test_health_endpoints(self):
        """Test health check endpoints"""
        print("\n🏥 Testing Health Check Endpoints")
        
        # Test root endpoint
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "JEE Tracker API" in data["message"]:
                    self.log_test("Root Health Check", True, "API root endpoint working")
                else:
                    self.log_test("Root Health Check", False, "Invalid response format", data)
            else:
                self.log_test("Root Health Check", False, f"Status {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Root Health Check", False, f"Connection error: {str(e)}")

        # Test health endpoint
        try:
            response = self.session.get(f"{API_BASE}/health")
            if response.status_code == 200:
                data = response.json()
                if "status" in data and data["status"] == "healthy":
                    self.log_test("Health Endpoint", True, "Health check endpoint working")
                else:
                    self.log_test("Health Endpoint", False, "Invalid health response", data)
            else:
                self.log_test("Health Endpoint", False, f"Status {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Health Endpoint", False, f"Connection error: {str(e)}")

    def test_motivational_quotes(self):
        """Test motivational quotes endpoint"""
        print("\n💡 Testing Motivational Quotes")
        
        try:
            response = self.session.get(f"{API_BASE}/quote")
            if response.status_code == 200:
                data = response.json()
                if "quote" in data and "tip" in data:
                    self.log_test("Motivational Quote", True, f"Quote retrieved: '{data['quote'][:50]}...'")
                else:
                    self.log_test("Motivational Quote", False, "Missing quote or tip fields", data)
            else:
                self.log_test("Motivational Quote", False, f"Status {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Motivational Quote", False, f"Error: {str(e)}")

    def test_user_registration(self):
        """Test user registration"""
        print("\n👤 Testing User Registration")
        
        try:
            response = self.session.post(
                f"{API_BASE}/auth/register",
                json=self.test_user,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.access_token = data["access_token"]
                    self.user_id = data["user"]["id"]
                    self.log_test("User Registration", True, f"User registered successfully: {data['user']['name']}")
                    
                    # Set authorization header for future requests
                    self.session.headers.update({"Authorization": f"Bearer {self.access_token}"})
                else:
                    self.log_test("User Registration", False, "Missing access_token or user in response", data)
            elif response.status_code == 400:
                # User might already exist, try login instead
                self.log_test("User Registration", True, "User already exists (expected for repeated tests)")
                self.test_user_login()
            else:
                self.log_test("User Registration", False, f"Status {response.status_code}", response.text)
        except Exception as e:
            self.log_test("User Registration", False, f"Error: {str(e)}")

    def test_user_login(self):
        """Test user login"""
        print("\n🔐 Testing User Login")
        
        try:
            login_data = {
                "email": self.test_user["email"],
                "password": self.test_user["password"]
            }
            
            response = self.session.post(
                f"{API_BASE}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.access_token = data["access_token"]
                    self.user_id = data["user"]["id"]
                    self.log_test("User Login", True, f"Login successful: {data['user']['name']}")
                    
                    # Set authorization header for future requests
                    self.session.headers.update({"Authorization": f"Bearer {self.access_token}"})
                else:
                    self.log_test("User Login", False, "Missing access_token or user in response", data)
            else:
                self.log_test("User Login", False, f"Status {response.status_code}", response.text)
        except Exception as e:
            self.log_test("User Login", False, f"Error: {str(e)}")

    def test_protected_endpoints(self):
        """Test protected endpoints that require authentication"""
        print("\n🔒 Testing Protected Endpoints")
        
        if not self.access_token:
            self.log_test("Protected Endpoints", False, "No access token available")
            return

        # Test get current user
        try:
            response = self.session.get(f"{API_BASE}/auth/me")
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "email" in data:
                    self.log_test("Get Current User", True, f"User profile retrieved: {data['name']}")
                else:
                    self.log_test("Get Current User", False, "Invalid user profile response", data)
            else:
                self.log_test("Get Current User", False, f"Status {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get Current User", False, f"Error: {str(e)}")

    def test_user_stats(self):
        """Test user statistics endpoint"""
        print("\n📊 Testing User Statistics")
        
        if not self.access_token:
            self.log_test("User Stats", False, "No access token available")
            return

        try:
            response = self.session.get(f"{API_BASE}/user/stats")
            if response.status_code == 200:
                data = response.json()
                required_fields = ["totalXP", "currentStreak", "totalStudyHours", "completedTopics", "totalTopics"]
                if all(field in data for field in required_fields):
                    self.log_test("User Stats", True, f"Stats retrieved - XP: {data['totalXP']}, Topics: {data['completedTopics']}/{data['totalTopics']}")
                else:
                    self.log_test("User Stats", False, "Missing required stats fields", data)
            else:
                self.log_test("User Stats", False, f"Status {response.status_code}", response.text)
        except Exception as e:
            self.log_test("User Stats", False, f"Error: {str(e)}")

    def test_syllabus_endpoints(self):
        """Test syllabus management endpoints"""
        print("\n📚 Testing Syllabus Management")
        
        if not self.access_token:
            self.log_test("Syllabus Endpoints", False, "No access token available")
            return

        # Test get complete syllabus
        try:
            response = self.session.get(f"{API_BASE}/syllabus/")
            if response.status_code == 200:
                data = response.json()
                if "mains" in data and "advanced" in data:
                    # Count total topics
                    total_topics = 0
                    for exam_type in ["mains", "advanced"]:
                        for subject, topics in data[exam_type].items():
                            total_topics += len(topics)
                    
                    self.log_test("Get Syllabus", True, f"Syllabus retrieved with {total_topics} topics")
                    
                    # Test updating a topic status if topics exist
                    if total_topics > 0:
                        self.test_topic_update(data)
                else:
                    self.log_test("Get Syllabus", False, "Invalid syllabus structure", data)
            else:
                self.log_test("Get Syllabus", False, f"Status {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Get Syllabus", False, f"Error: {str(e)}")

    def test_topic_update(self, syllabus_data):
        """Test updating topic status"""
        print("\n✏️ Testing Topic Status Update")
        
        # Find first topic to update
        topic_id = None
        topic_name = None
        
        for exam_type in ["mains", "advanced"]:
            for subject, topics in syllabus_data[exam_type].items():
                if topics:
                    topic_id = topics[0]["id"]
                    topic_name = topics[0]["topic"]
                    break
            if topic_id:
                break
        
        if not topic_id:
            self.log_test("Topic Update", False, "No topics found to update")
            return

        try:
            update_data = {
                "status": "mastered",
                "highYield": True
            }
            
            response = self.session.put(
                f"{API_BASE}/syllabus/topic/{topic_id}",
                json=update_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    xp_awarded = data.get("xpAwarded", 0)
                    self.log_test("Topic Update", True, f"Topic '{topic_name}' updated successfully (XP: +{xp_awarded})")
                else:
                    self.log_test("Topic Update", False, "Invalid update response", data)
            else:
                self.log_test("Topic Update", False, f"Status {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Topic Update", False, f"Error: {str(e)}")

    def test_progress_tracking(self):
        """Test progress tracking endpoints"""
        print("\n📈 Testing Progress Tracking")
        
        if not self.access_token:
            self.log_test("Progress Tracking", False, "No access token available")
            return

        try:
            response = self.session.get(f"{API_BASE}/syllabus/progress/overall")
            if response.status_code == 200:
                data = response.json()
                required_fields = ["totalTopics", "completedTopics", "progressPercentage", "subjectProgress"]
                if all(field in data for field in required_fields):
                    progress = data["progressPercentage"]
                    self.log_test("Overall Progress", True, f"Progress tracking working - {progress}% complete")
                else:
                    self.log_test("Overall Progress", False, "Missing progress fields", data)
            else:
                self.log_test("Overall Progress", False, f"Status {response.status_code}", response.text)
        except Exception as e:
            self.log_test("Overall Progress", False, f"Error: {str(e)}")

    def test_xp_system(self):
        """Test XP system functionality"""
        print("\n⭐ Testing XP System")
        
        if not self.access_token:
            self.log_test("XP System", False, "No access token available")
            return

        try:
            # Add XP to user
            response = self.session.post(
                f"{API_BASE}/user/xp?xp_amount=50&reason=Test%20completion",
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "newTotalXP" in data and "newLevel" in data:
                    self.log_test("XP Addition", True, f"XP added successfully - Total: {data['newTotalXP']}, Level: {data['newLevel']}")
                else:
                    self.log_test("XP Addition", False, "Invalid XP response", data)
            else:
                self.log_test("XP Addition", False, f"Status {response.status_code}", response.text)
        except Exception as e:
            self.log_test("XP Addition", False, f"Error: {str(e)}")

    def test_error_handling(self):
        """Test error handling for invalid requests"""
        print("\n🚫 Testing Error Handling")
        
        # Test invalid endpoint
        try:
            response = self.session.get(f"{API_BASE}/invalid-endpoint")
            if response.status_code == 404:
                self.log_test("Invalid Endpoint", True, "404 error correctly returned for invalid endpoint")
            else:
                self.log_test("Invalid Endpoint", False, f"Expected 404, got {response.status_code}")
        except Exception as e:
            self.log_test("Invalid Endpoint", False, f"Error: {str(e)}")

        # Test unauthorized access
        try:
            # Remove authorization header temporarily
            auth_header = self.session.headers.get("Authorization")
            if auth_header:
                del self.session.headers["Authorization"]
            
            response = self.session.get(f"{API_BASE}/user/stats")
            if response.status_code == 401:
                self.log_test("Unauthorized Access", True, "401 error correctly returned for unauthorized access")
            else:
                self.log_test("Unauthorized Access", False, f"Expected 401, got {response.status_code}")
            
            # Restore authorization header
            if auth_header:
                self.session.headers["Authorization"] = auth_header
                
        except Exception as e:
            self.log_test("Unauthorized Access", False, f"Error: {str(e)}")

    def run_all_tests(self):
        """Run all test suites"""
        print(f"🧪 JEE Tracker Backend API Test Suite")
        print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Run test suites in order
        self.test_health_endpoints()
        self.test_motivational_quotes()
        self.test_user_registration()
        self.test_protected_endpoints()
        self.test_user_stats()
        self.test_syllabus_endpoints()
        self.test_progress_tracking()
        self.test_xp_system()
        self.test_error_handling()
        
        # Print summary
        self.print_summary()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   ❌ {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        
        # Return exit code
        return 0 if failed_tests == 0 else 1

if __name__ == "__main__":
    tester = JEETrackerAPITest()
    exit_code = tester.run_all_tests()
    sys.exit(exit_code)