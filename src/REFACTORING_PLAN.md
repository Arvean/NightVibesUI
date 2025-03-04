# NightVibes Refactoring Plan

This document outlines the refactoring plan for both the backend (Django) and frontend (React Native) of the NightVibes project.

## Part 1: Backend Refactoring (Django)

### 1.1. Environment Variables and Settings

*   **Task:** Move sensitive and environment-specific settings to environment variables.
*   **Files:** `NightVibes/settings.py`
*   **Steps:**
    1.  Install `python-dotenv`:  `pip install python-dotenv` (if not already installed).
    2.  Create a `.env` file in the project root (same level as `manage.py`):
        ```
        SECRET_KEY=<your_secret_key>
        DEBUG=False
        ALLOWED_HOSTS=localhost,127.0.0.1
        DATABASE_URL=postgres://postgres:postgres@db:5432/nightvibes
        FIREBASE_CREDENTIALS_PATH=credentials.json
        ```
    3.  Modify `settings.py` to load environment variables:

        ```python
        import os
        from dotenv import load_dotenv

        load_dotenv()

        SECRET_KEY = os.environ['SECRET_KEY']
        DEBUG = os.environ.get('DEBUG', 'False') == 'True'  # Default to False
        ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')
        DATABASE_URL = os.environ['DATABASE_URL']
        FIREBASE_CREDENTIALS_PATH = os.environ.get('FIREBASE_CREDENTIALS_PATH', 'credentials.json')

        # Database settings (using dj-database-url for parsing DATABASE_URL)
        import dj_database_url
        DATABASES = {
            'default': dj_database_url.config(default=DATABASE_URL)
        }
        ```
    4.  Install `dj-database-url`: `pip install dj-database-url`
    5.  Update `requirements.txt`: Add `python-dotenv` and `dj-database-url`.
    6.  **Important:**  Ensure the `.env` file is *never* committed to version control (add it to `.gitignore`).

### 1.2. Settings Structure (Optional, but Recommended)

*   **Task:** Split `settings.py` into multiple files for different environments.
*   **Files:** `NightVibes/settings/` (new directory)
*   **Steps:**
    1.  Create a `settings` directory: `mkdir NightVibes/settings`
    2.  Create `base.py`, `dev.py`, and `prod.py` inside the `settings` directory.
    3.  Move common settings to `base.py`.
    4.  In `dev.py` and `prod.py`, import `base.py` and override specific settings:

        ```python
        # dev.py
        from .base import *

        DEBUG = True
        ALLOWED_HOSTS = ['localhost', '127.0.0.1']
        # ... other development settings
        ```

        ```python
        # prod.py
        from .base import *

        DEBUG = False
        ALLOWED_HOSTS = ['your-production-domain.com']
        # ... other production settings
        ```
    5.  Modify `manage.py`, `wsgi.py`, and `asgi.py` to use the correct settings file (e.g., `NightVibes.settings.dev` for development).

### 1.3. Model Refactoring (`App/models.py`)

*   **Task:** Remove redundant `update_location()` and unused fields from `UserProfile`.
*   **File:** `App/models.py`
*   **Steps:**
    1.  Remove the `update_location()` method from the `UserProfile` model.
    2.  Remove the `last_location_lat` and `last_location_lng` fields from the `UserProfile` model.
    3.  Add docstrings to all models and fields.

### 1.4. Serializer Refactoring (`App/serializers.py`)

*   **Task:** Rename `latitude` and `longitude` in `UserProfileSerializer`. Add `friend_count`.
*   **File:** `App/serializers.py`
*   **Steps:**
    1.  Rename `latitude` to `new_latitude` and `longitude` to `new_longitude` in `UserProfileSerializer`.
    2.  Add a `SerializerMethodField` for `friend_count`:

        ```python
        friend_count = serializers.SerializerMethodField()

        class Meta:
            model = UserProfile
            fields = ['id', 'user', 'username', 'email', 'bio', 'location_sharing',
                     'new_latitude', 'new_longitude', 'current_location', 'profile_picture', 'friends', 'friend_count']
            read_only_fields = ('friends',) # Remove friend_count from here

        def get_friend_count(self, obj):
            return obj.get_friend_count() # Use existing cached method
        ```
    3. Add docstrings.

### 1.5. View Refactoring (`App/views.py`)

*   **Task:** Refactor `VenueListView`, `VenueDetailView`, and `VenueRatingView`.
*   **File:** `App/views.py`
*   **Steps:**
    1.  **`VenueListView`**:
        *   Extract popularity calculation to `App/utils.py`:

            ```python
            # App/utils.py
            from django.utils import timezone
            from django.db.models import Count, Q, F, ExpressionWrapper, FloatField
            from .models import Venue

            def calculate_venue_popularity(venue):
                recent_time = timezone.now() - timezone.timedelta(hours=24)
                checkin_count = venue.checkin_set.filter(timestamp__gte=recent_time).count()
                avg_rating = venue.ratings.aggregate(models.Avg('rating'))['rating__avg'] or 0
                return (checkin_count * 0.7) + (avg_rating * 0.3)
            ```
        *   Use DRF's built-in filtering and ordering backends:

            ```python
            from rest_framework import filters

            class VenueListView(generics.ListCreateAPIView):
                # ...
                filter_backends = [filters.SearchFilter, filters.OrderingFilter]
                search_fields = ['name', 'description']
                ordering_fields = ['distance', 'popularity_score'] # Add custom field
                ordering = ['distance'] # Default ordering

                def get_queryset(self):
                    queryset = Venue.objects.all()
                    category = self.request.query_params.get('category')
                    if category:
                        queryset = queryset.filter(category__iexact=category)

                    latitude = self.request.query_params.get('latitude')
                    longitude = self.request.query_params.get('longitude')
                    if latitude and longitude:
                        user_location = Point(float(longitude), float(latitude), srid=4326)
                        queryset = queryset.annotate(
                            distance=Distance('location', user_location)
                        )
                        # Add popularity score annotation for sorting
                        queryset = queryset.annotate(
                            popularity_score=ExpressionWrapper(
                                (Count('checkin', filter=Q(checkin__timestamp__gte=timezone.now() - timezone.timedelta(hours=24))) * 0.7) +
                                (F('ratings__rating__avg') * 0.3),
                                output_field=FloatField()
                            )
                        )
                    return queryset
            ```

    2.  **`VenueDetailView`**:
        *   Remove duplicate filtering logic (use the same filter backend as `VenueListView`).
        *   Use a serializer for the `current_vibe` response:

            ```python
            # In serializers.py
            class VenueVibeSerializer(serializers.Serializer):
                vibe = serializers.CharField()
                popularity_score = serializers.FloatField()
                updated_at = serializers.DateTimeField()

            # In views.py
            @action(detail=True, methods=['get'])
            def current_vibe(self, request, pk=None):
                venue = self.get_object()
                vibe_data = {
                    'vibe': venue.get_current_vibe() or 'Unknown',
                    'popularity_score': venue.get_popularity_score(),
                    'updated_at': timezone.now()
                }
                serializer = VenueVibeSerializer(vibe_data)
                return Response(serializer.data)
            ```

    3.  **`VenueRatingView`**:
        *   Refactor to use a `ModelViewSet` instead of separate `ListCreateAPIView` and `UpdateAPIView`.

            ```python
            class VenueRatingViewSet(viewsets.ModelViewSet):
                serializer_class = VenueRatingSerializer
                permission_classes = [permissions.IsAuthenticated]

                def get_queryset(self):
                    return VenueRating.objects.filter(user=self.request.user)

                def perform_create(self, serializer):
                    serializer.save(user=self.request.user)
            ```
        *   Update `urls.py` to use the ViewSet:
            ```python
            from rest_framework.routers import DefaultRouter

            router = DefaultRouter()
            router.register(r'venues', VenueDetailView) # Use VenueDetailView as ViewSet
            router.register(r'friend-requests', FriendRequestViewSet)
            router.register(r'meetup-pings', MeetupPingViewSet)
            router.register(r'device-tokens', DeviceTokenViewSet)
            router.register(r'notifications', NotificationViewSet)
            router.register(r'ratings', VenueRatingViewSet) # Add VenueRatingViewSet

            urlpatterns = [
                path('admin/', admin.site.urls),
                path('api/', include(router.urls)), # Use router.urls
                path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
                path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
                path('api/register/', UserCreate.as_view(), name='user_register'),
                path('api/profile/', UserProfileView.as_view(), name='user_profile'),
                path('api/friends/', UserFriendsView.as_view(), name='user_friends'),
                path('api/venues/', VenueListView.as_view(), name='venue_list'),
                path('api/checkins/', CheckInListView.as_view(), name='checkin_list'),
                path('api/checkins/<int:pk>/', CheckInDetailView.as_view(), name='checkin_detail'),
                path('api/friends/nearby/', NearbyFriendsView.as_view(), name='nearby_friends'),
            ]
            ```

### 1.6. Move helper functions

* **Task:** Move helper functions to `App/utils.py`
* **File:** `App/utils.py`
* **Steps:**
    1. Move `calculate_venue_popularity` to `App/utils.py`

## Part 2: Frontend Testing Refactoring (React Native)

### 2.1. Create Directory Structure

*   **Task:** Create the directory structure for test setup and templates.
*   **Steps:**
    *   These directories and files were already created in the previous plan, so this step is just to confirm they exist.

### 2.2. Create `mockProviders.js`

*   **Task:** Create `mockProviders.js` with the provided content.
*   **File:** `NightVibesUI/src/__tests__/setup/mockProviders.js`
*   **Steps:**
    1.  Create the file.
    2.  Copy the code from the previous plan into the file.

### 2.3. Create `mockFactories.js`

*   **Task:** Create `mockFactories.js` with the provided content.
*   **File:** `NightVibesUI/src/__tests__/setup/mockFactories.js`
*   **Steps:**
    1.  Create the file.
    2.  Copy the code from the previous plan into the file.

### 2.4. Create `testUtils.js`

*   **Task:** Create `testUtils.js` with the provided content.
*   **File:** `NightVibesUI/src/__tests__/setup/testUtils.js`
*   **Steps:**
    1.  Create the file.
    2.  Copy the code from the previous plan into the file.

### 2.5. Create Test Templates

*   **Task:** Create test templates.
*   **Files:**
    *   `NightVibesUI/src/__tests__/templates/screenTest.js`
    *   `NightVibesUI/src/__tests__/templates/contextTest.js`
    *   `NightVibesUI/src/__tests__/templates/hookTest.js` (This one wasn't detailed, but create an empty file for now)
*   **Steps:**
    1.  Create the files.
    2.  Copy the code from the previous plan into the files.

### 2.6. Update `setupTests.js`

* **Task:** Update NightVibesUI/src/setupTests.js to include mock resets.
* **File:** NightVibesUI/src/setupTests.js
* **Steps:**
    1. Add the following to `setupTests.js`:
    ```javascript
    import { defaultAuthState } from './__mocks__/AuthContext';
    import { defaultThemeState } from './__mocks__/ThemeContext';

    beforeEach(() => {
      jest.clearAllMocks();
      // Reset AuthContext mock
      for (const key in defaultAuthState) {
        if (typeof defaultAuthState[key] === 'function') {
          defaultAuthState[key].mockClear();
        }
      }

      // Reset ThemeContext mock (if needed)
      for (const key in defaultThemeState) {
          if (typeof defaultThemeState[key] === 'function') {
              defaultThemeState[key].mockClear();
          }
      }
    });
    ```

### 2.7. Update `__mocks__/AuthContext.js` and `__mocks__/ThemeContext.js`

* **Task:** Update the AuthContext and ThemeContext mocks to match the actual implementations.
* **Files:**
    *   `NightVibesUI/src/__mocks__/AuthContext.js`
    *   `NightVibesUI/src/__mocks__/ThemeContext.js`
* **Steps:**
    1. Replace the contents of `NightVibesUI/src/__mocks__/AuthContext.js`
    2. Replace the contents of `NightVibesUI/src/__mocks__/ThemeContext.js`

### 2.8 Update Existing Tests

* **Task:** Begin updating existing test files to use the new utilities and patterns. Start with `AuthContext.test.js`.
* **Files:** `NightVibesUI/src/__tests__/AuthContext.test.js` (and others, iteratively)
