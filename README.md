# Note Taking App

## How to run the app

You can run the app using the following command:

```bash
docker-compose up --build
```

## Features
- [x] See note list
- [x] Create a new note
- [x] Modify an existing note
- [x] Delete a note
- [x] Show the modification history of a note
  - [x] Optional: Have a "git diff" like to see the changes from previous versions
- [x] Go back to a previous version


## Technical choices

### Backend

- The backend uses a mongoDB database to store the notes. This allows for easy storage and retrieval of notes and also handles "big" notes with ease compared to a SQL database.
- Pydantic is used to validate the data sent to the backend. This allows for easy validation of the data and also provides a nice way to document the API.
- FastAPI provides an openAPI documentation of the API which allowed to create a custom client to interact with the API. This client is used in the frontend.
- I used uv to handle my virtual environment in dev. I could have used poetry but I wanted to try uv in this project.

### Frontend

- React-router is used to handle the routing of the app. This allows for easy navigation between the different pages of the app and also easier handling of shared layout.
- Bun is used as a package manager. I also could have used Node but I like to use Bun for my personal projects as I find it faster (as a package manager) than npm/pnpm (never used yarn) and acts as a drop-in replacement for Node. I also wanted at a first glance to use it instead of Vite but I ended up with some issues with the environment variables and the way it handles them.
- I used SCSS to style the app. I'm used to it and that's why I chose it. I'm not really used to Tailwind, it could have been a good choice too I think.

### Docker
Docker is used to run the app in "production mode". This allows for easy deployment of the app and also makes it easier to run the app on different machines. I used docker-compose to run the app, but podman-compose should also work (didn't test it though).

## Possible Improvements
- Better NGINX configuration (didn't put much effort into it)
- Better CORS in the backend (currently allows all origins)
- Better error handling in the frontend (currently only log the errors to the console). I could for example use a toast library (like [react-toastify](https://www.npmjs.com/package/react-toastify)) to show the errors to the user.
- Better styling of the app. I'm not a designer, even though I tried to have a usable and nice design, I don't find it very attractive.
- Add tests to the frontend.

## Feature ideas
- [ ] Add a search bar to search for notes
- [ ] Add a tag system to categorize notes
- [ ] Add a dark mode
- [ ] Add a login system
