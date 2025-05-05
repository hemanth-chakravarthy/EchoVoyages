# Deploying EchoVoyages on Render with Vercel Frontend

This guide explains how to deploy the EchoVoyages backend on Render using Docker, while the frontend is deployed on Vercel at https://echo-voyages.vercel.app.

## Prerequisites

1. A Render account (https://render.com)
2. Your code pushed to a GitHub repository
3. MongoDB Atlas account for the database (or use Render's MongoDB service)

## Deployment Steps

### 1. Set Up MongoDB

If using MongoDB Atlas:
1. Create a new cluster in MongoDB Atlas
2. Create a database user with appropriate permissions
3. Get your connection string from MongoDB Atlas
4. Replace `<username>`, `<password>`, and `<dbname>` with your actual values

### 2. Deploy Using Render Blueprint

1. Log in to your Render dashboard
2. Click on "New" and select "Blueprint"
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file in your repository
5. Review the services that will be created
6. Click "Apply" to start the deployment

### 3. Configure Environment Variables

After the services are created, you'll need to set up the environment variables:

1. Go to the backend service in your Render dashboard
2. Navigate to the "Environment" tab
3. Add the following environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `NODE_ENV`: Set to "production"
   - `PORT`: Set to "10000"
   - `FRONTEND_URL`: Set to "https://echo-voyages.vercel.app"

### 4. Verify Deployment

1. Once the backend deployment is complete, visit your Vercel frontend at https://echo-voyages.vercel.app
2. Verify that the application loads correctly and can connect to the backend
3. Test key functionality to ensure everything works as expected
4. Check the logs for both Render (backend) and Vercel (frontend) for any errors

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify your MongoDB connection string is correct
   - Ensure your IP is whitelisted in MongoDB Atlas

2. **CORS Errors**
   - Check that the frontend URL is correctly set in the backend CORS configuration
   - Verify that the backend URL is correctly set in the frontend environment

3. **Build Failures**
   - Check the build logs for specific errors
   - Ensure all dependencies are correctly specified in package.json

4. **File Upload Issues**
   - For production, consider using a cloud storage service like AWS S3 or Cloudinary

## Maintenance

### Updating Your Deployment

1. Push changes to your GitHub repository
2. Render will automatically rebuild and deploy your changes

### Monitoring

1. Use Render's built-in logs to monitor your application
2. Set up alerts for critical errors

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
