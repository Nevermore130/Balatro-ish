<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1710rUicl98ge0jICe-d9jAg4S7uRkaUm

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Docker Deployment

**Prerequisites:** Docker and Docker Compose

### Quick Start with Docker Compose

1. Create a `.env` file with your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. Build and run the container:
   ```bash
   docker-compose up -d --build
   ```

3. Access the app at: http://localhost:3000

4. View logs:
   ```bash
   docker-compose logs -f
   ```

5. Stop the container:
   ```bash
   docker-compose down
   ```

For more detailed Docker deployment instructions, see [DOCKER.md](DOCKER.md).
