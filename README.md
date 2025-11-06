# 🏠 Bangalore Home Price Prediction

A **full-stack Machine Learning web app** that predicts house prices in Bangalore based on location, area (sqft), number of bedrooms (BHK), and bathrooms.  
Built with **Flask**, **scikit-learn**, and deployed on **AWS Elastic Beanstalk** using **Docker**.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![Flask](https://img.shields.io/badge/Flask-3.0.3-lightgrey)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3.2-orange)
![AWS Elastic Beanstalk](https://img.shields.io/badge/AWS-Elastic%20Beanstalk-green)
![Docker](https://img.shields.io/badge/Deployed-Docker-blue)

---

## 🌐 Live Demo

👉 [**Launch Application**](http://housing-price-env.eba-dkie955x.ap-south-1.elasticbeanstalk.com){:target="_blank"}

---

## ✨ Features

- 🧠 **Machine Learning Powered** — Predicts home prices using a trained Linear Regression model  
- 📍 **240+ Bangalore Locations** — Dynamic location dropdown with real data  
- 🧾 **Instant Predictions** — Real-time results with no reload  
- 🌗 **Dark Mode** — Toggle-friendly, responsive design  
- 🔒 **Backend Optimized** — Cached ML artifacts for faster predictions  
- ☁️ **AWS Deployment** — Dockerized and deployed on Elastic Beanstalk  
- ⚙️ **Health & Monitoring** — `/health` endpoint for uptime checks  

---

## 🛠️ Tech Stack

| Layer | Technologies |
|--------|---------------|
| **Frontend** | HTML5, CSS3, JavaScript, jQuery |
| **Backend** | Flask, Gunicorn |
| **ML Model** | scikit-learn, NumPy, Pandas |
| **Deployment** | Docker, AWS Elastic Beanstalk (Amazon Linux 2) |
| **Version Control** | Git & GitHub |

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

### 🐳 Docker Local Testing

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

**Last Updated**: November 2025

