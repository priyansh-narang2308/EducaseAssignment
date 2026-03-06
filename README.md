# Nativee - Professional Product Explorer

Nativee is a high-performance React Native application designed for exploring products via the DummyJSON API. Built with a focus on scalability, performance, and robust state management, this project demonstrates senior-level architectural patterns for mobile development.

---

## Architecture & Technical Decisions

### 1. Layered Architecture (SoC)
The project follows a strict **Separation of Concerns (SoC)** by dividing the codebase into logical layers:
*   **API Layer**: Centralized `Axios` instance in `apiClient.ts` with service-specific logic in `productsApi.ts`. This makes it trivial to add interceptors (auth/logging) or swap the networking library in the future.
*   **State Layer (Redux)**: Using `@reduxjs/toolkit` for predictable state transitions and `createAsyncThunk` for standardized side-effect handling.
*   **UI Layer**: Functional components with `React.memo` and optimized `FlatList` implementations to ensure 60fps scrolling even with complex data.
*   **Storage Layer**: Dedicated persistence utilities that abstract `AsyncStorage` interactions.

### 2. Why Redux?
While simpler state managers exist, **Redux + Redux Toolkit** was chosen for several critical reasons:
*   **Predictability**: Actions and reducers provide a clear "paper trail," making debugging complex state transitions across three screens straightforward.
*   **Persistence**: Built-in support for `redux-persist` allows for granular control over what data is saved (e.g., blacklisting transient loading states).
*   **Global Access**: Product data fetched on the Home screen is instantly accessible to the Details screen without redundant prop drilling or unnecessary API calls.
*   **Tooling**: Access to powerful debugging tools like Redux DevTools.

### 3. Implementation of Pagination
The app implements **Infinite Scrolling** on the `HomeScreen`:
*   **Calculation**: We track `skip` and `limit` in the Redux store. Each successful fetch increments the `skip` by the number of items received.
*   **Trigger**: The `onEndReached` prop of `FlatList` is configured with a `0.5` threshold, initiating the next fetch well before the user hits the bottom.
*   **Optimization**: `initialNumToRender` and `windowSize` are tuned to minimize the memory footprint of off-screen components.

### 4. Advanced Persistence Strategy
Persistence is handled via `redux-persist` with **Granular Whitelisting**:
*   **What is saved?**: The product list, total count, and current pagination offset.
*   **What is ignored?**: Transient states like `loading`, `error`, and `searchQuery` are blacklisted. This prevents the "zombie state" bug where a user restarts the app and is greeted by a stale spinner or old error message.
*   **Sync**: A custom `AppNavigator` ensures the `PersistGate` has fully rehydrated the store before the UI is rendered to the user.

### 5. Lifecycle & AppState Management
Mobile apps have a unique lifecycle (Foreground -> Background -> Killed). Nativee handles this via a custom `useAppStatePersistence` hook:
*   **Background Sync**: When the user swicthes apps or goes to the home screen, the app detects the `inactive`/`background` state and triggers `persistor.flush()`. This ensures all pending Redux state is immediately written to the disk.
*   **Resumption**: Upon re-opening (even if the app was killed by the system), the `PersistGate` automatically restores the state from `AsyncStorage`.

---

## Getting Started

### Prerequisites
*   Node.js (LTS)
*   React Native CLI
*   Xcode (for iOS)
*   CocoaPods

### Installation
1.  **Clone the Repo**:
    ```bash
    git clone [your-repo-link]
    cd Nativee
    ```
2.  **Dependencies**:
    ```bash
    npm install
    ```
3.  **iOS Pods (Crucial)**:
    ```bash
    cd ios
    pod install
    cd ..
    ```

### Running the App
*   **Start the Bundler**:
    ```bash
    npm start
    ```
*   **iOS**:
    ```bash
    npm run ios
    ```
*   **Android**:
    ```bash
    npm run android
    ```

---

## Key Components & Optimizations
*   **`ProductItem`**: Optimized with `React.memo` to skip re-renders if props haven't changed.
*   **`useAppStatePersistence`**: A custom hook ensuring no data loss on app suspension.
*   **`DetailsScreen`**: Implements a "Cache-First" UI—it shows the data already in the store while fetching a fresh/complete copy from the API in the background.
