# 🏠 Bangalore Home Price Prediction

A full-stack web application that predicts house prices in Bangalore using machine learning. The application uses a trained scikit-learn model to estimate property prices based on location, area, number of bedrooms (BHK), and bathrooms.

**🌐 Live Demo:** [http://housing-price-env.eba-dkie955x.ap-south-1.elasticbeanstalk.com](http://housing-price-env.eba-dkie955x.ap-south-1.elasticbeanstalk.com)

---

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [File Analysis](#file-analysis)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)

---

## ✨ Features

- 🎯 **ML-Powered Predictions**: Uses a trained Linear Regression model to estimate house prices
- 🌍 **Location-Based**: Supports 240+ locations across Bangalore
- 🎨 **Modern UI**: Clean, responsive design with dark mode support
- 🔄 **Real-time Validation**: Client-side form validation with error handling
- 🚀 **Production-Ready**: Deployed on AWS Elastic Beanstalk with Docker
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

---

## 📁 Project Structure

```
Housing Price Prediction/
├── application.py              # Entry point for AWS Elastic Beanstalk
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker container configuration
├── .ebignore                   # Files to exclude from EB deployment
├── .dockerignore              # Files to exclude from Docker builds
├── client/                     # Frontend files
│   ├── app.html               # Main HTML page
│   ├── app.js                 # JavaScript logic and API calls
│   ├── app.css                # Stylesheet with dark mode support
│   └── columns.json           # Location data (fallback)
├── server/                     # Backend application
│   ├── server.py              # Flask application with routes
│   ├── util.py                # ML model utilities and prediction logic
│   └── artifacts/             # ML model files
│       ├── banglore_home_prices_model.pickle  # Trained model
│       └── columns.json       # Feature columns (locations)
└── model/                      # Training data and notebooks
    ├── bangalore_house_prices.csv  # Dataset
    └── bangalore_home_prices.ipynb # Jupyter notebook for training
```

---

## 🛠 Technology Stack

### Backend
- **Flask 3.0.3**: Web framework for API endpoints
- **Gunicorn 21.2.0**: WSGI HTTP server for production
- **scikit-learn 1.3.2**: Machine learning model (Linear Regression)
- **NumPy 1.26.4**: Numerical computations
- **Pandas 2.2.2**: Data manipulation (for training)

### Frontend
- **HTML5/CSS3**: Structure and styling
- **JavaScript (Vanilla)**: Client-side logic and API calls
- **jQuery 3.4.1**: DOM manipulation and AJAX requests

### Infrastructure
- **Docker**: Containerization for consistent deployments
- **AWS Elastic Beanstalk**: Platform-as-a-Service for deployment
- **AWS ECR**: Container registry for Docker images

---

## 📄 File Analysis

### Core Application Files

#### `application.py`
- **Purpose**: Entry point for AWS Elastic Beanstalk
- **Function**: Imports the Flask app from `server.server` and exposes it as `application`
- **Key Point**: EB uses this to locate the WSGI application object

#### `server/server.py`
- **Purpose**: Main Flask application with all API routes
- **Key Features**:
  - Loads ML artifacts on startup (model and location data)
  - Serves static frontend files from `client/` directory
  - Provides REST API endpoints for predictions
- **Routes**:
  - `GET /`: Serves the main HTML page
  - `GET /get_location_names`: Returns list of available locations
  - `POST /predict_home_price`: Accepts form data and returns price prediction
  - `GET /health`: Health check endpoint for monitoring

#### `server/util.py`
- **Purpose**: ML model utilities and prediction logic
- **Key Functions**:
  - `load_saved_artifacts()`: Loads the trained model and location data from pickle/JSON files
  - `get_estimated_price(location, sqft, bhk, bath)`: Core prediction function
    - Creates one-hot encoded feature vector
    - Uses the trained model to predict price
    - Returns price in Lakhs (Indian currency unit)
  - `get_location_names()`: Returns list of supported locations
- **Architecture**: Uses global variables to cache model and data for performance

### Frontend Files

#### `client/app.html`
- **Purpose**: Main user interface
- **Features**:
  - Form with inputs for area, BHK, bathrooms, and location
  - Radio buttons for BHK and bathroom selection
  - Searchable location dropdown (HTML5 datalist)
  - Dark mode toggle button
  - Result display area with loading states
  - Error message display

#### `client/app.js`
- **Purpose**: Client-side JavaScript logic
- **Key Functions**:
  - `onPageLoad()`: Fetches location list from API on page load
  - `onClickedEstimatePrice()`: Validates form, sends POST request, displays result
  - `validateForm()`: Client-side validation before submission
  - `toggleTheme()`: Dark/light mode toggle with localStorage persistence
  - `resetForm()`: Clears form and resets UI state
- **Error Handling**: Includes fallback to local JSON if API fails

#### `client/app.css`
- **Purpose**: Styling for the application
- **Features**:
  - Modern, clean design
  - Dark mode support
  - Responsive layout
  - Smooth transitions and animations

### Model Files

#### `server/artifacts/banglore_home_prices_model.pickle`
- **Purpose**: Trained scikit-learn Linear Regression model
- **Training**: Trained on `model/bangalore_house_prices.csv` dataset
- **Features**: 243+ features (3 numerical: sqft, bath, bhk + 240 location one-hot encodings)

#### `server/artifacts/columns.json`
- **Purpose**: Feature column definitions
- **Structure**: JSON with `data_columns` array
  - First 3: `['total_sqft', 'bath', 'bhk']`
  - Remaining: Location names (one-hot encoded)

### Deployment Files

#### `Dockerfile`
- **Purpose**: Container definition for Docker deployment
- **Base Image**: `python:3.11-slim` (lightweight, stable)
- **Steps**:
  1. Installs system dependencies (gcc for NumPy compilation)
  2. Copies and installs Python dependencies
  3. Copies application code
  4. Exposes port 5000
  5. Runs Gunicorn with Flask app

#### `requirements.txt`
- **Purpose**: Python package dependencies
- **Dependencies**:
  - Flask: Web framework
  - Gunicorn: Production WSGI server
  - scikit-learn: ML model library
  - NumPy: Numerical operations
  - Pandas: Data handling
  - joblib: Model serialization (used by scikit-learn)

#### `.ebignore`
- **Purpose**: Excludes files from Elastic Beanstalk deployment
- **Excluded**: Development files, notebooks, virtual environments, AWS CLI installers

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.11+
- pip (Python package manager)
- Docker (for containerized deployment)
- AWS CLI (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Housing Price Prediction"
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python application.py
   # Or directly:
   python server/server.py
   ```

5. **Access the application**
   - Open browser: `http://localhost:5000`
   - API endpoint: `http://localhost:5000/predict_home_price`

### Docker Local Testing

1. **Build the Docker image**
   ```bash
   docker build -t housing-price:latest .
   ```

2. **Run the container**
   ```bash
   docker run -p 5000:5000 housing-price:latest
   ```

3. **Access**: `http://localhost:5000`

---

## ☁️ Deployment

### AWS Elastic Beanstalk Deployment

The application is deployed on AWS Elastic Beanstalk using Docker containers.

**Deployment URL**: [http://housing-price-env.eba-dkie955x.ap-south-1.elasticbeanstalk.com](http://housing-price-env.eba-dkie955x.ap-south-1.elasticbeanstalk.com)

#### Deployment Steps

1. **Build and push Docker image to ECR**
   ```bash
   # Set AWS region
   aws configure set default.region ap-south-1
   
   # Create ECR repository
   aws ecr create-repository --repository-name housing-price --region ap-south-1
   
   # Get login token
   aws ecr get-login-password --region ap-south-1 | \
     docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-1.amazonaws.com
   
   # Build and tag image
   docker build -t housing-price:latest .
   docker tag housing-price:latest <account-id>.dkr.ecr.ap-south-1.amazonaws.com/housing-price:latest
   
   # Push to ECR
   docker push <account-id>.dkr.ecr.ap-south-1.amazonaws.com/housing-price:latest
   ```

2. **Initialize Elastic Beanstalk**
   ```bash
   eb init -p docker housing-price --region ap-south-1
   ```

3. **Create and deploy environment**
   ```bash
   eb create housing-price-env --single --instance_type t2.micro
   eb deploy
   ```

4. **Monitor deployment**
   ```bash
   eb status
   eb events --verbose
   eb logs
   ```

5. **Open the application**
   ```bash
   eb open
   ```

### Environment Configuration

- **Platform**: Docker running on 64bit Amazon Linux 2
- **Instance Type**: t2.micro (free tier eligible)
- **Region**: ap-south-1 (Mumbai)
- **Port**: 5000 (internal), 80/443 (external via EB)

---

## 🔌 API Endpoints

### GET `/`
- **Description**: Serves the main HTML page
- **Response**: HTML file (`client/app.html`)

### GET `/get_location_names`
- **Description**: Returns list of available locations
- **Response**:
  ```json
  {
    "locations": ["1st Phase JP Nagar", "1st Block Jayanagar", ...]
  }
  ```
- **CORS**: Enabled (`Access-Control-Allow-Origin: *`)

### POST `/predict_home_price`
- **Description**: Predicts house price based on input parameters
- **Request Body** (form-data):
  - `total_sqft`: float (square feet)
  - `location`: string (location name)
  - `bhk`: int (number of bedrooms)
  - `bath`: int (number of bathrooms)
- **Response**:
  ```json
  {
    "estimated_price": 45.67
  }
  ```
- **Price Unit**: Lakhs (Indian currency, 1 Lakh = 100,000 INR)
- **CORS**: Enabled

### GET `/health`
- **Description**: Health check endpoint
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

---

## 💻 Usage

1. **Open the application** in your browser
2. **Enter property details**:
   - **Area**: Total square footage (e.g., 1000, 1500, 2000)
   - **BHK**: Number of bedrooms (1-5)
   - **Bath**: Number of bathrooms (1-5)
   - **Location**: Select from dropdown (e.g., "1st Phase JP Nagar", "Whitefield")
3. **Click "Estimate Price"** button
4. **View the prediction** in Lakhs (Indian Rupees)
5. **Toggle dark mode** using the moon/sun icon

### Example Prediction

- **Area**: 1200 sqft
- **BHK**: 2
- **Bath**: 2
- **Location**: "1st Phase JP Nagar"
- **Estimated Price**: ~45.67 Lakhs

---

## 🧪 Model Details

- **Algorithm**: Linear Regression (scikit-learn)
- **Features**: 
  - Numerical: `total_sqft`, `bath`, `bhk`
  - Categorical: Location (one-hot encoded, 240+ locations)
- **Training Data**: `model/bangalore_house_prices.csv`
- **Training Notebook**: `model/bangalore_home_prices.ipynb`

---

## 🔧 Troubleshooting

### Common Issues

1. **Model not loading**
   - Ensure `server/artifacts/` directory contains both `.pickle` and `columns.json` files
   - Check file paths in `server/util.py`

2. **Port conflicts**
   - Change port in `server/server.py` if 5000 is occupied
   - Update Dockerfile EXPOSE directive accordingly

3. **CORS errors**
   - Already handled with `Access-Control-Allow-Origin: *` headers
   - If issues persist, check browser console for specific errors

4. **Deployment failures**
   - Verify Docker image is pushed to ECR
   - Check EB logs: `eb logs`
   - Ensure IAM role has ECR read permissions

---

## 📝 License

This project is open source and available for educational purposes.

---

## 👤 Author

Built with ❤️ for predicting Bangalore home prices accurately.

---

## 🙏 Acknowledgments

- Dataset: Bangalore House Prices
- ML Framework: scikit-learn
- Web Framework: Flask
- Deployment Platform: AWS Elastic Beanstalk

---

**Last Updated**: November 2025

