# Inspector Mobile

React Native mobile frontend for the existing Spring Boot backend. This app supports only:

- `INSPECTOR`
- `TEACHER`

Features included:

- Login with email and password
- JWT storage with `AsyncStorage`
- Role-based protected navigation
- Inspector calendar and activity details
- Teacher calendar and activity details

## Tech stack

- React Native with Expo
- React Navigation
- Axios
- AsyncStorage
- `react-native-calendars`

## 1. Install dependencies

From [front_mobile](C:\Users\SPIRIT\Desktop\pfe\inspector4\inspector\front_mobile):

```bash
npm install
```

## 2. Configure backend URL

Create a `.env` file in `front_mobile` based on `.env.example`.

Example:

```env
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8081
```

Useful values:

- Android emulator: `http://10.0.2.2:8081`
- iOS simulator: `http://localhost:8081`
- Physical device: `http://YOUR_COMPUTER_LOCAL_IP:8081`

Make sure the Spring Boot backend is already running before starting the mobile app.

## 3. Run the app

```bash
npm run start
```

Then choose one of:

```bash
npm run android
```

```bash
npm run ios
```

## Backend endpoints used

Confirmed from the current Spring Boot codebase:

- `POST /api/auth/login`
- `GET /api/inspector/activities`
- `GET /api/inspector/activities/{id}`
- `GET /api/teacher/activities`

## Notes about teacher activity details

The backend clearly exposes the teacher activities list endpoint, but there is no confirmed teacher-specific activity details endpoint in the current codebase.

Current mobile behavior:

- The details screen opens immediately with the activity data already available from the calendar list.
- The app also tries `GET /api/activities/{id}` as a placeholder fetch.

TODO in code:

- Replace the placeholder teacher details endpoint in `src/services/api.js` if your backend later exposes an exact route for teacher activity details.

## Project structure

```text
src/
  components/
  context/
  navigation/
  screens/
  services/
  utils/
```
